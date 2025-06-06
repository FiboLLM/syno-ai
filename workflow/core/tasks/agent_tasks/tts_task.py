from typing import List
from pydantic import Field
from workflow.core.tasks.task import AliceTask
from workflow.core.agent import AliceAgent
from workflow.core.data_structures import (
    FunctionParameters, ParameterDefinition, MessageDict, ApiType, References, NodeResponse, TasksEndCodeRouting
)
from workflow.core.api import APIManager
from workflow.util import LOGGER, get_traceback

class TextToSpeechTask(AliceTask):
    """
    A specialized task for converting text to speech using AI text-to-speech models.

    TextToSpeechTask provides a straightforward implementation for text-to-speech conversion,
    using a single node execution model. It handles voice selection, speed adjustment, and
    returns audio content as file references.

    Key Features:
    -------------
    * Audio Generation:
        - Converts text input to speech
        - Supports multiple voice options
        - Configurable speech speed

    * File Management:
        - Returns audio as FileContentReference
        - Handles audio file formatting
        - Includes metadata in references

    Attributes:
    -----------
    agent : AliceAgent
        Agent configured with TTS model capabilities
        
    input_variables : FunctionParameters
        Accepts:
        - text (str): Content to convert to speech
        - voice (str, optional): Voice ID to use (default: "nova")
        - speed (float, optional): Speech speed multiplier (default: 1.0)
        
    required_apis : List[ApiType]
        [ApiType.TEXT_TO_SPEECH]

    Example:
    --------
    ```python
    tts_task = TextToSpeechTask(
        agent=agent_with_tts,
        task_name="text_to_speech",
        task_description="Convert text to spoken audio"
    )
    
    response = await tts_task.run(
        text="Hello, world!",
        voice="nova",
        speed=1.2
    )
    ```
    """
    agent: AliceAgent = Field(..., description="The agent to use for the task")
    input_variables: FunctionParameters = Field(
        default=FunctionParameters(
            type="object",
            properties={
                "text": ParameterDefinition(
                    type="string",
                    description="The text to convert to speech."
                ),
                "voice": ParameterDefinition(
                    type="string",
                    description="The voice to use for the speech synthesis.",
                    default="nova"
                ),
                "speed": ParameterDefinition(
                    type="number",
                    description="The speed of the speech synthesis.",
                    default=1.0
                )
            },
            required=["text"]
        )
    )
    required_apis: List[ApiType] = Field([ApiType.TEXT_TO_SPEECH], description="A list of required APIs for the task")
    start_node: str = Field(default='text_to_speech', description="The name of the starting node")
    node_end_code_routing: TasksEndCodeRouting = Field(default={
        'text_to_speech': {
            0: (None, False),
            1: ('text_to_speech', True),
        }
    }, description="A dictionary of tasks/nodes -> exit codes and the task to route to given each exit code")

    async def execute_text_to_speech(self, execution_history: List[NodeResponse], node_responses: List[NodeResponse], **kwargs) -> NodeResponse:
        api_manager: APIManager = kwargs.get("api_manager")
        text: str = kwargs.get('text', "")
        voice: str = kwargs.get('voice', "nova")
        speed: float = kwargs.get('speed', 1.0)
        
        try:
            refs = await self.agent.generate_speech(api_manager=api_manager, input=text, voice=voice, speed=speed)
            return NodeResponse(
                parent_task_id=self.id,
                node_name="text_to_speech",
                exit_code=0,
                references=refs,
                execution_order=len(execution_history)
            )
        except Exception as e:
            LOGGER.error(f"Error in speech generation: {e}")
            return NodeResponse(
                parent_task_id=self.id,
                node_name="text_to_speech",
                exit_code=1,
                references=References(messages=[MessageDict(
                    role="system",
                    content=f"Speech generation failed: {str(e)}\n\n" + get_traceback(),
                    generated_by="system"
                )]),
                execution_order=len(execution_history)
            )