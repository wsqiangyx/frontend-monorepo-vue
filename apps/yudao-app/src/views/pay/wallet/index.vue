<template>
  <PageContainer title="钱包管理">
    <t-card>
      <t-tabs v-model="activeTab">
        <t-tab-panel value="balance" label="钱包余额">
          <t-table :data="balanceData" :columns="balanceColumns" :loading="loading" row-key="id" class="mt-4">
            <template #totalBalance="{ row }">
              {{ (row.totalBalance / 100).toFixed(2) }}
            </template>
            <template #freezeBalance="{ row }">
              {{ (row.freezeBalance / 100).toFixed(2) }}
            </template>
          </t-table>
        </t-tab-panel>
        <t-tab-panel value="package" label="充值套餐">
          <t-space class="mt-4 mb-4">
            <t-button theme="primary" @click="handleAddPackage">新增</t-button>
          </t-space>
          <t-table :data="packageData" :columns="packageColumns" :loading="loading" row-key="id">
            <template #payPrice="{ row }">
              {{ (row.payPrice / 100).toFixed(2) }}
            </template>
            <template #bonusPrice="{ row }">
              {{ (row.bonusPrice / 100).toFixed(2) }}
            </template>
            <template #status="{ row }">
              <t-tag :theme="row.status === 0 ? 'success' : 'warning'">{{ row.status === 0 ? '开启' : '关闭' }}</t-tag>
            </template>
            <template #action="{ row }">
              <t-space>
                <t-link theme="primary" @click="handleEditPackage(row)">编辑</t-link>
                <t-popconfirm content="确认删除？" @confirm="handleDeletePackage(row)">
                  <t-link theme="danger">删除</t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-tab-panel>
        <t-tab-panel value="transaction" label="交易记录">
          <t-table :data="transactionData" :columns="transactionColumns" :loading="loading" row-key="id" class="mt-4">
            <template #price="{ row }">
              <span :style="{ color: row.price >= 0 ? 'green' : 'red' }">
                {{ row.price >= 0 ? '+' : '' }}{{ (row.price / 100).toFixed(2) }}
              </span>
            </template>
            <template #totalBalance="{ row }">
              {{ (row.totalBalance / 100).toFixed(2) }}
            </template>
          </t-table>
        </t-tab-panel>
      </t-tabs>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'PayWallet' })

const loading = ref(false)
const activeTab = ref('balance')
const balanceData = ref<Record<string, unknown>[]>([])
const packageData = ref<Record<string, unknown>[]>([])
const transactionData = ref<Record<string, unknown>[]>([])

const balanceColumns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'userId', title: '用户ID' },
  { colKey: 'totalBalance', title: '总余额(元)' },
  { colKey: 'freezeBalance', title: '冻结金额(元)' },
  { colKey: 'createTime', title: '创建时间', width: 170 },
]

const packageColumns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '套餐名称' },
  { colKey: 'payPrice', title: '充值金额(元)' },
  { colKey: 'bonusPrice', title: '赠送金额(元)' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

const transactionColumns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'userId', title: '用户ID' },
  { colKey: 'title', title: '交易标题' },
  { colKey: 'price', title: '交易金额(元)' },
  { colKey: 'totalBalance', title: '交易后余额(元)' },
  { colKey: 'createTime', title: '创建时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const [bal, pkg, txn] = await Promise.all([
      fetch('/api/pay/wallet/balance/page?pageNo=1&pageSize=50').then((r) => r.json()),
      fetch('/api/pay/wallet/recharge-package/page?pageNo=1&pageSize=50').then((r) => r.json()),
      fetch('/api/pay/wallet/transaction/page?pageNo=1&pageSize=50').then((r) => r.json()),
    ])
    if (bal.code === 0) balanceData.value = bal.data.list ?? []
    if (pkg.code === 0) packageData.value = pkg.data.list ?? []
    if (txn.code === 0) transactionData.value = txn.data.list ?? []
  } catch { MessagePlugin.error('加载失败') } finally { loading.value = false }
}

function handleAddPackage() { MessagePlugin.info('新增充值套餐') }
function handleEditPackage(row: Record<string, unknown>) { MessagePlugin.info('编辑：' + row.name) }
async function handleDeletePackage(row: Record<string, unknown>) {
  try { await fetch(`/api/pay/wallet/recharge-package/delete?id=${row.id}`, { method: 'DELETE' }); MessagePlugin.success('删除成功'); fetchData() } catch { MessagePlugin.error('删除失败') }
}

onMounted(fetchData)
</script>
