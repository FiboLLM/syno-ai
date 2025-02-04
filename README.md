# Fibo: Framework for Intelligent Behavior and Operations

![Fibo LOGO](/frontend/public/fainllmlogo.png)

Fibo is a cutting-edge framework designed to build and deploy AI agents that seamlessly integrate automated task execution with interactive chat capabilities. Built on a microservices architecture and powered by MongoDB for persistent data storage, Fibo simplifies the creation, management, and deployment of AI agents across various applications.

> What's new? v0.3 brings:
>
> - RAG: Support for RAG with the new Retrieval Task, which takes a prompt and a Data Cluster, and returns chunks with highest similarity. It can also be used to ensure a Data Cluster is fully embedded.
> - HITL: Human-in-the-loop mechanics to tasks -> Add a User Checkpoint to a task or a chat, and force a user interaction 'pause' whenever the chosen node is reached
> - COT: A basic Chain-of-thought implementation: [analysis] tags are parsed on the frontend, and added to the agent's system prompts allowing them think through requests more effectively
> - DOCUMENTS: fibo Documents, represented by the [fiboDocument] tag, are parsed on the frontend and added to the agent's system prompts allowing them to structure their responses better
> - NODE FLOW: Fully implemented node execution logic to tasks, making workflows simply a case where the nodes are other tasks. This allows for greater clarity on what each task is doing and why
> - FLOW VIEWER: Updated the task UI to show more details on the task's inner node logic and flow
> - PROMPT PARSER: Added the option to view templated prompts dynamically, to see how they look with certain inputs, and get a better sense of what your agents see
> - APIS: New APIs for Wolfram Alpha, Google's Knowledge Graph, PixArt Image Generation (local), Bark TTS (local). Support for local embeddings
> - DATA CLUSTERS: Now chats and tasks can hold updatable data clusters that hold embeddable references like messages, files, task responses, etc. You can add any reference in your environment to a data cluster to give your chats/tasks access to it. The new retrieval tasks leverage this.
> - TEXT MGMT: Added 2 Text Splitter methods (recursive and semantic), which are used by the embedding and RAG logic (as well as other APIs with that need to chunk the input, except LLMs), and a Message Pruner class that scores and prunes messages, which is used by the LLM API engines to avoid contex size issues
> - REDIS QUEUE: Implemented a queue system for the Workflow module to handle incoming requests -> now it can handle concurrent tasks being executed
> - **NOTE**: If you update to this version, you'll need to reinitialize your database (User settings -> Danger Zone). This update required a lot of changes to the framework, and making it backwards compatible is inefficient at this stage. Keep in mind Project fibo is still in Alpha, and changes should be expected

> v0.3.5:
>
> - BACKEND:
>   - Refactored the LM STUDIO manager, but now requires you use a specific build (0.3.5 9-H is functional), since with the speed of development, the LMS SDK is evolving quickly.
>   - Added a 'populated' endpoint to all routes in order to avoid unnecessary bloating -> Now the frontend only retrieves non-populated items when loading collection lists
> - FRONTEND:
>   - Optimized item population to reduce memory hog. Now viewing items will require loading them, but having a big database won't break your computer.
>   - Added a Context % estimation to the chat interface.
>   - Added an API validation for chats and task to check that they have all the necessary APIs available.
>   - Added a status section for LM Studio to the User Settings, as well as one for the Workflow module.
>   - Added a menu to all item cards and forms with functions like (1) download, (2) copy, (3) duplicate, (4) delete (forms) and (5) edit (cards).
> - WORKFLOW:
>   - Updated the communication to the Backend, both to get the new populated routes and to properly use LM Studio
>   - Fixed a lot of issues with task/workflow and code execution logic.

> v0.3.10:
>
> - BACKEND:
> - Added encryption to most reference objects. You will need to restart your DB if you update to this version.

> v0.3.11:
>
> - THREADS:
> - Now chats have message threads, instead of messages, allowing a single chat to have any number of "threads" or conversations in it
> - Allows threads to be used in multiple chats, including back and forth: you start a chat, at some point you want to get input from a different agent/model/chat combo, so you add the thread to another chat and regenerate the answer (or ask a follow up request).
> - Now you don't need to create a new chat to start a new conversation either -> just create a new thread and start from scratch
> - ADMIN:
> - Implementend the first version of an Admin role and functions. First user in a local implementation is admin, and can manage other users.
> - For now its mostly about being able to deploy API keys after the initial account creation.

> What's next? Planned developments for v0.4 (find detailed info below):
>
> - Agent using computer
> - Communication APIs -> Gmail, potentially messaging
> - Recurring tasks -> Tasks that run periodically, accumulating information in their Data Cluster
> - CUDA support for the Workflow container -> Run a wide variety of local models, with a lot more flexibility
> - Testing module -> Build a set of tests (inputs + tasks), execute it, update your tasks/prompts/agents/models/etc. and run them again to compare
> - Context Management w/LLM -> Use an LLM model to (1) summarize long messages to keep them in context or (2) identify repeated information that can be removed

## Project Structure

The project consists of three main components:

1. Backend (Node.js with Express - TS) -> Manages the MongoDB, LM Studio generations and the file system, including serving files for the frontend.
2. Workflow (Python - Pydantic) -> Handles (most) of the logic, interacts with external APIs, consumes the Database through the Backend, and reads from the file system. Main endpoints are task execution and chat response generation.
3. Frontend (React - TS) -> UI that consumes/interacts with the DB and file system through the Backend and calls Workflow's endpoints to trigger executions.

![Container Flow](/frontend/public/shared/img/diagrams/Container_flow.png)

## The Goal

1. Develop a tool for creating, testing, and deploying agent-driven solutions.
2. Design a human-language framework where text serves as the primary input and output, ensuring accessibility for both users and agents.
3. Build a model-agnostic and brand-neutral framework, giving users full flexibility in configuring and deploying their solutions.
4. Provide an open-source alternative that empowers users with greater control.

## Setup and Installation

1. Ensure you have Git and [Docker installed](https://docs.docker.com/engine/install/) on your system. On Windows, once you do, it comes with the docker-compose plugin installed by default, but [check if you have it installed](https://stackoverflow.com/questions/72928891/how-can-i-check-if-docker-compose-plugin-is-installed). Otherwise (if in Linux for example), [install it](https://docs.docker.com/compose/install/linux/). If for whatever reason the starting script doesn't start Docker (can't find it), all you need to do is open your Docker app.

2. (Optional) [Install LM Studio](https://lmstudio.ai/) if you plan to use local models. If you don't, you'll see some errors regarding this, but don't worry, everything else will work normally. NOTE: There's a protocol issues with some versions of LM Studio, recommend using -> 0.3.5 (build 9-H)

3. Download the repository:

   ```
   git clone https://github.com/YourRepo/fainllm.git
   ```

4. Create an `.env` file in the root directory using the `template.env` file as a reference. Complete the data for any APIs you want to use (e.g., OpenAI API key). Even if you don't update anything, if you don't create it / copy it, the build process will fail.

5. Run the appropriate script for your operating system:
   - Windows: Run `run.bat`
   - Linux/Mac: Run `run.sh`

Alternatively you can just execute run.py using `python run.py`/`python3 run.py` in a commandline while in the repository folder

This will build and launch the containers. Once ready, the frontend will be accessible at `http://localhost:4000/`.

> If you see an error during the installation related to `403  connecting to archive.ubuntu.com` or `ETIMEDOUT`, just run it again. Sometimes Docker has an issue installing an image due to connection errors.

> **NOTE**: If you want to update, run `python update.py`

## Framework

![Logic Flow](/frontend/public/shared/img/diagrams/basic_logic_flow.png)

The framework is based around 4 main components:

- APIs and their engine
- Agents, which deploy prompts and have models for any API they want to use
- Tasks that leverage agents, other tasks and APIs to produce an output
- Chats, that leverage tasks and agents, to produce a conversational experience

These components share information in one of 6 main ways, all of which have a string representation:

- Files (All file types have a method for generating a 'transcript' for the file, and files generated through prompts keep it as a representation)
- Messages
- Task Results
- Entity References
- User Interactions
- Embeddings

## Task Execution

>>>>>>> e23bb30 (Update README.md)
Tasks consist of interconnected "nodes" that define execution logic. Each task starts with a designated start_node and follows the routing defined in node_end_code_routing.

Task Types API Tasks: Interact with external services such as Google Search or Wikipedia. Prompt Agent Tasks: Use prompts and LLMs for advanced logic execution, including: Code Execution: Executes code blocks in Docker containers. Code Generation: Ensures output includes required code blocks. Workflows: Chains multiple tasks to form complex processes.

MIT License

Copyright (c) 2025 Fibo LLM

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
