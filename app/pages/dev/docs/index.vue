<script setup lang="ts">
import { models } from '~/data/mock'

const selectedApi = ref('qax-security-llm')
const showDebugger = ref(false)
const activeTab = ref('request')
const sdkTab = ref('python')

const apiEndpoints = computed(() => {
  return models.slice(0, 4).map(m => ({
    id: m.id,
    name: m.name,
    endpoint: m.apiEndpoint,
    method: m.id === 'qax-security-llm' ? 'POST' : 'POST',
    description: m.description,
    typeColor: m.typeColor
  }))
})

const currentApi = computed(() => apiEndpoints.value.find(a => a.id === selectedApi.value))

const requestSchema = computed(() => {
  const schemas: Record<string, object> = {
    'qax-security-llm': {
      model: 'qax-security-llm',
      messages: [
        { role: 'system', content: '你是一个安全专家助手' },
        { role: 'user', content: '请分析以下安全事件...' }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: false
    },
    'threat-detect-v3': {
      model: 'threat-detect-v3',
      content: '可疑网络流量数据或日志内容',
      analysis_type: 'apt_chain',
      include_ioc: true,
      detail_level: 'high'
    },
    'vuln-analyzer-pro': {
      model: 'vuln-analyzer-pro',
      cve_id: 'CVE-2026-XXXX',
      code_snippet: '待分析代码片段',
      analysis_type: 'full',
      include_poc: true
    },
    'code-security-scan': {
      model: 'code-security-scan',
      code: '待扫描源代码',
      language: 'python',
      scan_type: 'sast',
      include_fix: true
    }
  }
  return schemas[selectedApi.value] || {}
})

const responseSchema = {
  id: 'resp-xxxxxx',
  object: 'chat.completion',
  created: 1720000000,
  model: 'qax-security-llm',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: '分析结果...'
      },
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 128,
    completion_tokens: 256,
    total_tokens: 384
  }
}

const sdkInstallCommands: Record<string, { install: string; example: string }> = {
  python: {
    install: 'pip install qax-ai-sdk',
    example: `from qax_ai import QAXClient

client = QAXClient(api_key="sk-qax-xxxxx")

response = client.chat.completions.create(
    model="qax-security-llm",
    messages=[
        {"role": "user", "content": "分析此安全事件"}
    ]
)

print(response.choices[0].message.content)`
  },
  java: {
    install: 'Maven: qax-ai-sdk\nGradle: implementation("com.qax.ai:sdk:1.0.0")',
    example: `import com.qax.ai.QAXClient;
import com.qax.ai.model.ChatCompletion;

QAXClient client = new QAXClient("sk-qax-xxxxx");

ChatCompletion response = client.chat()
    .model("qax-security-llm")
    .message("user", "分析此安全事件")
    .execute();

System.out.println(response.getContent());`
  },
  go: {
    install: 'go get github.com/qax-ai/sdk-go',
    example: `package main

import (
    "fmt"
    qax "github.com/qax-ai/sdk-go"
)

func main() {
    client := qax.NewClient("sk-qax-xxxxx")
    resp, _ := client.ChatCompletion(&qax.ChatRequest{
        Model: "qax-security-llm",
        Messages: []qax.Message{
            {Role: "user", Content: "分析此安全事件"},
        },
    })
    fmt.Println(resp.Choices[0].Message.Content)
}`
  },
  nodejs: {
    install: 'npm install @qax-ai/sdk',
    example: `import { QAXClient } from '@qax-ai/sdk';

const client = new QAXClient({ apiKey: 'sk-qax-xxxxx' });

const response = await client.chat.completions.create({
  model: 'qax-security-llm',
  messages: [
    { role: 'user', content: '分析此安全事件' }
  ]
});

console.log(response.choices[0].message.content);`
  }
}
</script>

<template>
  <div>
    <DevSidebar />
    <div class="ml-60 flex">
      <!-- API List Sidebar -->
      <div class="w-56 shrink-0 border-r border-gray-100 bg-white h-screen sticky top-0 pt-8">
        <div class="px-4 mb-4">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">API列表</h3>
        </div>
        <nav class="px-2 space-y-0.5">
          <button
            v-for="api in apiEndpoints"
            :key="api.id"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200"
            :class="selectedApi === api.id
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50'"
            @click="selectedApi = api.id"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ background: api.typeColor }"
            />
            <span class="text-sm truncate">{{ api.name }}</span>
          </button>
        </nav>
      </div>

      <!-- API Detail -->
      <div class="flex-1 p-8 overflow-y-auto">
        <div v-if="currentApi" class="max-w-4xl">
          <!-- API Header -->
          <div class="mb-6">
            <h1 class="text-xl font-bold text-gray-900 mb-2">{{ currentApi.name }}</h1>
            <p class="text-sm text-gray-400">{{ currentApi.description }}</p>
          </div>

          <!-- Endpoint Info -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h3 class="font-semibold text-gray-900 mb-4">接口信息</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold font-mono">
                  POST
                </span>
                <code class="text-sm font-mono text-gray-700">https://api.qianxin.ai{{ currentApi.endpoint }}</code>
              </div>

              <!-- Headers -->
              <div>
                <p class="text-xs font-medium text-gray-500 mb-2">Request Headers</p>
                <div class="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 space-y-1.5">
                  <p><span class="text-green-400">Content-Type</span>: <span class="text-amber-300">application/json</span></p>
                  <p><span class="text-green-400">Authorization</span>: <span class="text-amber-300">Bearer sk-qax-your-api-key</span></p>
                  <p><span class="text-green-400">X-Request-ID</span>: <span class="text-gray-500">optional-uuid</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Request Body -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h3 class="font-semibold text-gray-900 mb-4">Request Body</h3>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="font-mono text-xs text-gray-300">{{ JSON.stringify(requestSchema, null, 2) }}</pre>
            </div>
          </div>

          <!-- Response Schema -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <h3 class="font-semibold text-gray-900 mb-4">Response Schema</h3>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="font-mono text-xs text-gray-300">{{ JSON.stringify(responseSchema, null, 2) }}</pre>
            </div>
          </div>

          <!-- Online Debugger -->
          <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">在线调试</h3>
              <button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                :class="showDebugger
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-primary-600 text-white hover:bg-primary-700'"
                @click="showDebugger = !showDebugger"
              >
                {{ showDebugger ? '收起' : '打开调试器' }}
              </button>
            </div>

            <div v-if="showDebugger" class="space-y-4">
              <!-- Request Editor -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-gray-500">Request Body</p>
                  <button class="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    发送请求
                  </button>
                </div>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="font-mono text-xs text-gray-300">{{ JSON.stringify(requestSchema, null, 2) }}</pre>
                </div>
              </div>

              <!-- Response -->
              <div>
                <p class="text-xs font-medium text-gray-500 mb-2">Response</p>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="font-mono text-xs text-green-400">{
  "status": 200,
  "data": {
    "id": "resp-demo-001",
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "根据分析，该安全事件..."
        }
      }
    ]
  }
}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- SDK Downloads -->
          <div class="bg-white rounded-xl border border-gray-100 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">SDK 接入</h3>
            <div class="flex items-center gap-2 mb-4">
              <button
                v-for="(cmd, lang) in sdkInstallCommands"
                :key="lang"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                :class="sdkTab === lang
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                @click="sdkTab = lang"
              >
                {{ lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1) }}
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <p class="text-xs font-medium text-gray-500 mb-2">安装</p>
                <div class="bg-gray-900 rounded-lg p-4">
                  <code class="font-mono text-xs text-green-400">{{ sdkInstallCommands[sdkTab]?.install }}</code>
                </div>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 mb-2">示例代码</p>
                <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre class="font-mono text-xs text-gray-300 whitespace-pre-wrap">{{ sdkInstallCommands[sdkTab]?.example }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
