### 🚀 AI-Driven Real-time Observability Agent
Transforming Raw Logs into Actionable Insights with Event-Driven AI
This project is a high-performance Real-time Log Analysis Engine designed to monitor distributed systems. It doesn't just collect logs; it understands them. By leveraging Apache Kafka for streaming and Generative AI (Llama 3) for automated troubleshooting, it slashes MTTR (Mean Time To Recovery) by providing instant technical solutions for system errors.

### 🛠️ Tech Stack
    - Runtime: Node.js (NestJS Framework)

    - Message Broker: Apache Kafka (Event-Driven Architecture)

    - Search Engine: Elasticsearch (Log Indexing & Storage)

    - AI Engine: Groq Cloud API (Llama 3 / Mixtral Models)

    - Real-time UI: Socket.io (WebSockets)

Infrastructure: Docker & Docker Compose

### ✨ Key Features
Real-time Ingestion: Streams logs from multiple microservices via Kafka topics.

AI-Powered Diagnostics: Automatically identifies ERROR patterns and queries an LLM to generate a root-cause analysis and a fix.

Live Dashboard: A reactive frontend that pushes AI-generated solutions to developers in milliseconds using WebSockets.

Scalable Indexing: Stores processed logs in Elasticsearch for long-term observability and trend analysis.

Zero Latency Inference: Uses Groq's LPU technology for lightning-fast AI responses.

### 🏗️ System Architecture
Producers (Laravel/NestJS): Send structured logs to Kafka.

Kafka Broker: Acts as the resilient data backbone.

NestJS Consumer: Consumes logs, filters critical errors, and interacts with the Groq AI Agent.

Elasticsearch: Archives logs for full-text search and historical audits.

Socket.io Gateway: Broadcasts the AI's "Solution Brief" to the connected clients.

#### 🚀 Getting Started
1. Clone the repo

``` bash
git clone https://github.com/yourusername/ai-log-agent.git
cd ai-log-agent
``` 


2. Spin up Infrastructure (Docker)

``` bash 
docker-compose up -d
``` 
This starts Kafka, Zookeeper, and Elasticsearch.

3. Environment Setup
Create a .env file:

KAFKA_BROKER=localhost:9092
GROQ_API_KEY=your_groq_api_key
ELASTICSEARCH_NODE=http://localhost:9200
4. Install & Run

``` bash
npm install
npm run start:dev
``` 