import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse
from typing import List, Optional
from workflow.core.api.engines.llm_engines.llm_engine import LLMEngine
from workflow.core.data_structures import (
    MessageDict,
    ContentType,
    ModelConfig,
    References,
    ToolCall,
    ToolCallConfig,
    RoleTypes,
    MessageGenerators,
    ToolFunction,
)
from workflow.util import (
    LOGGER,
    est_messages_token_count,
    est_token_count,
    CHAR_TO_TOKEN,
    MessagePruner,
    ScoreConfig,
    MessageApiFormat,
)

class GeminiLLMEngine(LLMEngine):

    async def generate_api_response(
        self,
        api_data: ModelConfig,
        messages: List[MessageApiFormat],
        system: Optional[str] = None,
        tools: Optional[List[ToolFunction]] = None,
        tool_choice: Optional[str] = "auto",
        n: Optional[int] = 1,
        **kwargs,
    ) -> References:
        if not api_data.api_key:
            raise ValueError("API key not found in API data")

        LOGGER.debug(f"Gemini llm response generation with tools: {tools}")

        genai.configure(api_key=api_data.api_key)

        function_declarations = []
        if tools:
            LOGGER.debug(f"Tools: {tools}")
            # Convert tools to Gemini's function declarations format
            for tool in tools:
                function_declarations.append(
                    {
                        "name": tool.function.name,
                        "description": tool.function.description,
                        "parameters": tool.function.parameters.get_gemini_function(),
                    }
                )

        # Set up function calling configuration
        tool_config = None
        if function_declarations:
            tool_config = {"function_declarations": function_declarations}
        LOGGER.debug(f"Tool config: {tool_config}")

        estimated_tokens = est_messages_token_count(messages, tools) + est_token_count(
            system
        )
        # Prune messages if estimated tokens exceed context size
        if estimated_tokens > api_data.ctx_size:
            LOGGER.warning(
                f"Estimated tokens ({estimated_tokens}) exceed context size ({api_data.ctx_size}) of model {api_data.model}. Pruning. "
            )
            pruner = MessagePruner(
                max_total_size=api_data.ctx_size * CHAR_TO_TOKEN,
                score_config=ScoreConfig(),
            )
            messages = await pruner.prune(messages, self, api_data)
            estimated_tokens = est_messages_token_count(
                messages, tools
            ) + est_token_count(system)
            LOGGER.debug(f"Pruned message len: {estimated_tokens}")
        elif estimated_tokens > 0.8 * api_data.ctx_size:
            LOGGER.warning(
                f"Estimated tokens ({estimated_tokens}) are over 80% of context size ({api_data.ctx_size})."
            )
        try:
            # Prepare the chat history (all messages except the last one)
            history = []
            for message in messages[:-1]:
                role = (
                    "model"
                    if message["role"] == RoleTypes.ASSISTANT
                    else message["role"]
                )
                history.append({"role": role, "parts": message["content"]})

            # Get the last message as the new input
            new_message = (
                messages[-1]["content"] if messages else ""
            )  # Shouldn't we remove it if we are passing it as the new message?

            # Set up the model with system instruction if provided
            model_kwargs = {"model_name": api_data.model}
            if system:
                model_kwargs["system_instruction"] = system
            if tool_config:
                model_kwargs["tools"] = tool_config

            model = genai.GenerativeModel(**model_kwargs)

            # Start the chat with history
            chat = model.start_chat(history=history)

            generation_config = genai.types.GenerationConfig(
                max_output_tokens=api_data.max_tokens_gen,
                temperature=api_data.temperature,
            )

            # Send the new message to get the response
            response: GenerateContentResponse = chat.send_message(
                new_message,
                generation_config=generation_config,
            )

            # Process tool calls
            tool_calls = []
            for candidate in response.candidates:
                for part in candidate.content.parts:
                    if part.function_call:
                        tool_calls.append(
                            ToolCall(
                                type="function",
                                function=ToolCallConfig(
                                    arguments=part.function_call.args,
                                    name=part.function_call.name,
                                ),
                            )
                        )
            response_text: str = ""
            try:
                response_text = response.text
            except Exception as e:
                LOGGER.error(f"Error in Gemini API response processing: {str(e)}")
                try:
                    response_text = response.candidates[0].content.parts[0].text
                except Exception as e:
                    LOGGER.error(f"Error in Gemini API response processing: {str(e)}")
                    response_text = "N/A"

            msg = MessageDict(
                role=RoleTypes.ASSISTANT,
                content=response_text,
                references=References(tool_calls=tool_calls if tool_calls else None),
                generated_by=MessageGenerators.LLM,
                type=ContentType.TEXT,
                creation_metadata={
                    "model": api_data.model,
                    "usage": {
                        "prompt_tokens": response.usage_metadata.prompt_token_count,
                        "completion_tokens": response.usage_metadata.candidates_token_count,
                        "total_tokens": response.usage_metadata.total_token_count,
                    },
                    "finish_reason": response.candidates[0].finish_reason.name,
                    "estimated_tokens": int(estimated_tokens),
                    "cost": self.calculate_cost(
                        response.usage_metadata.prompt_token_count,
                        response.usage_metadata.candidates_token_count,
                        api_data,
                    ),
                },
            )
            return References(messages=[msg])

        except Exception as e:
            LOGGER.error(f"Error in Gemini API call: {str(e)}")
            raise
