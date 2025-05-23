# Introduction to the Alice System

Welcome to the Alice system documentation. Alice is a sophisticated AI-driven platform designed to facilitate complex workflows between AI agents, and a variety of tasks, APIs and data structures. This introduction provides an overview of the system's key components.
```User_prompt 
Lets do something fun: Why don't you use the image_gen_task to create a representation of yourself?
```
![Alice represents itself](../../shared/img/random/alice_represented_1_small.png)
```Assistant_prompt 
A friendly and intelligent AI assistant named Alice, represented as a glowing, ethereal blue hologram of a female face with circuit-like patterns, floating above a futuristic desk with holographic screens. The image should convey warmth, intelligence, and helpfulness
```
## System Overview

Alice is built on several core components that work together to create a versatile and powerful AI interaction environment:


![Logic Flow](../../shared/img/diagrams/basic_logic_flow.png)

1. **Agents**: The primary AI entities that interact with users and perform tasks. [LINK](/shared/knowledgebase/core/agent.md)
2. **Models**: The underlying AI models that power the agents' capabilities. [LINK](/shared/knowledgebase/core/model.md)
3. **Chats**: Conversational interfaces where users interact with agents. [LINK](/shared/knowledgebase/core/chat.md)
4. **Tasks**: Predefined operations that can be executed by agents or triggered within chats. [LINK](/shared/knowledgebase/core/task/task.md)
5. **APIs**: Interfaces to external services and AI providers. [LINK](/shared/knowledgebase/core/api/api.md)
6. **Prompts**: Templated instructions that guide AI behavior. [LINK](/shared/knowledgebase/core/prompt.md)
7. **Parameters**: Structured input definitions for tasks and prompts. [LINK](/shared/knowledgebase/core/parameter.md)
8. **Messages**: Individual units of communication within chats. [LINK](/shared/knowledgebase/core/message.md)
9.  **Task Responses**: Results and metadata from executed tasks. [LINK](/shared/knowledgebase/core/task_response.md)
10. **Entity References**: Managed references to external web resources. [LINK](/shared/knowledgebase/core/entity_reference.md)
11. **Files**: Handling of various file types with AI-readable transcripts. [LINK](/shared/knowledgebase/core/file.md)
12. **|COMING| Data Clusters**: Group references with managed embeddings to facilitate RAG and Fine-tunning, as well as providing a reusable context.

## Key Features

- **CHAT: Flexible AI Interactions**: Engage in open-ended conversations or structured task executions with AI agents.
- **TASKS: Extensible Task Framework**: Create and execute a wide variety of tasks, from simple API calls to complex workflows.
- **Multi-Modal Support**: Handle text, images, audio, and other file types seamlessly within the system within tasks and chats. Non-text files get transcribed so LLM-agents can "see".
- **Context-Aware Responses**: Utilize chat history, file transcripts, entity references and task responses in the agent's context for more intelligent interactions.
- **Integration Capabilities**: Connect with various external services and AI providers through the API system.
- **Customizable Behavior**: Tune AI tasks and agents using prompts, parameters and models to achieve the best result.
- **|COMING| Fine-Tune Models**: Use data-clusters to fine-tune your favorite models. 
- **|COMING| RAG-Powered Agents**: Deploy agents with RAG access to data-clusters to empower your workflows with your knowledgebase
- **|COMING| ReACT-Powered Agents**: Tool using agents can engage in ReACT-processes while in conversation to contemplate and acquire the necessary data for the task

## System Architecture Overview

The Alice system is designed with a modular architecture:

![Container Flow](../../shared/img/diagrams/Container_flow.png)

- **Frontend**: Where you probably are -> a ReactJS/TS user interface for interacting with the system, viewing the database and executing new processes.
- **Backend**: A NodeJS/TS module in charge of managing data persistence and authentication.
- **Workflow Engine**: Handles task execution and complex workflows, interfaces with various AI models and providers: handles all of the logic.

![Alice represents itself 2](../img/random/alice_represented_2_small.png)
```Assistant_prompt 
A friendly and intelligent AI assistant named Alice, represented as a glowing, ethereal blue hologram of a female face with circuit-like patterns, floating above a futuristic desk with holographic screens. The image should convey warmth, intelligence, and helpfulness.
```