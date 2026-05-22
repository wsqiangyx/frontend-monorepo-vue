import { defineComponent, h, ref, type PropType, type VNode } from 'vue'

// --- Types ---
export interface FlowNode {
  id: string
  type: 'start' | 'end' | 'approve' | 'condition' | 'cc' | 'delay'
  name: string
  assigneeType?: 'user' | 'role' | 'self' | 'leader'
  assigneeIds?: number[]
  conditions?: FlowCondition[]
  children?: FlowNode[]
}

export interface FlowCondition {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<='
  value: string
}

export interface FlowData {
  nodes: FlowNode
}

let nextNodeId = 1
function genId() {
  return `node_${nextNodeId++}`
}

function createDefaultFlow(): FlowNode {
  return {
    id: genId(),
    type: 'start',
    name: '开始',
    children: [
      {
        id: genId(),
        type: 'approve',
        name: '审批人',
        assigneeType: 'user',
        children: [{ id: genId(), type: 'end', name: '结束' }],
      },
    ],
  }
}

// --- Node type icons (emoji-based for simplicity) ---
const NODE_ICONS: Record<string, string> = {
  start: '▶',
  end: '⏹',
  approve: '👤',
  condition: '🔀',
  cc: '📋',
  delay: '⏰',
}

const NODE_COLORS: Record<string, string> = {
  start: '#52c41a',
  end: '#ff4d4f',
  approve: '#1890ff',
  condition: '#faad14',
  cc: '#722ed1',
  delay: '#13c2c2',
}

// --- Sub-components ---
function renderNodeCard(
  node: FlowNode,
  selectedId: string | null,
  onSelect: (id: string) => void,
): VNode {
  const isSelected = selectedId === node.id
  const color = NODE_COLORS[node.type] || '#999'
  const icon = NODE_ICONS[node.type] || '●'

  return h(
    'div',
    {
      class: 'simple-flow-node',
      style: {
        border: `2px solid ${isSelected ? color : '#ddd'}`,
        borderRadius: '8px',
        padding: '8px 16px',
        margin: '4px 0',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: isSelected ? `${color}11` : '#fff',
        minWidth: '120px',
        justifyContent: 'center',
        transition: 'all 0.2s',
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        onSelect(node.id)
      },
    },
    [
      h('span', { style: { fontSize: '16px' } }, icon),
      h('span', { style: { fontSize: '13px', fontWeight: 500 } }, node.name),
    ],
  )
}

function renderBranch(
  node: FlowNode,
  selectedId: string | null,
  onSelect: (id: string) => void,
  onAdd: (parentId: string, type: FlowNode['type']) => void,
): VNode {
  if (!node.children || node.children.length === 0) {
    return h(
      'div',
      {
        class: 'simple-flow-branch',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      },
      [renderNodeCard(node, selectedId, onSelect)],
    )
  }

  const childNodes = node.children.map((child) => renderBranch(child, selectedId, onSelect, onAdd))

  // For condition nodes, render children side by side
  if (node.type === 'condition' && node.children.length > 1) {
    return h(
      'div',
      {
        class: 'simple-flow-condition',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      },
      [
        renderNodeCard(node, selectedId, onSelect),
        h('div', { style: { width: '2px', height: '20px', background: '#ddd' } }),
        h('div', { style: { display: 'flex', gap: '16px', position: 'relative' } }, [
          ...node.children.map((child) =>
            h(
              'div',
              { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
              [
                h('div', { style: { width: '2px', height: '20px', background: '#ddd' } }),
                renderBranch(child, selectedId, onSelect, onAdd),
              ],
            ),
          ),
        ]),
      ],
    )
  }

  return h(
    'div',
    {
      class: 'simple-flow-branch',
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    },
    [
      renderNodeCard(node, selectedId, onSelect),
      h('div', { style: { width: '2px', height: '20px', background: '#ddd' } }),
      ...childNodes,
    ],
  )
}

function renderAddButtons(
  selectedId: string | null,
  onAdd: (parentId: string, type: FlowNode['type']) => void,
): VNode {
  if (!selectedId) return h('div')

  const btnStyle = (color: string) => ({
    padding: '4px 12px',
    borderRadius: '4px',
    border: `1px solid ${color}`,
    background: '#fff',
    color,
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s',
  })

  return h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' } }, [
    h(
      'button',
      { style: btnStyle('#1890ff'), onClick: () => onAdd(selectedId, 'approve') },
      '+ 审批节点',
    ),
    h(
      'button',
      { style: btnStyle('#faad14'), onClick: () => onAdd(selectedId, 'condition') },
      '+ 条件分支',
    ),
    h(
      'button',
      { style: btnStyle('#722ed1'), onClick: () => onAdd(selectedId, 'cc') },
      '+ 抄送节点',
    ),
    h(
      'button',
      { style: btnStyle('#13c2c2'), onClick: () => onAdd(selectedId, 'delay') },
      '+ 延时节点',
    ),
  ])
}

function renderPropertiesPanel(node: FlowNode | null, onUpdate: (node: FlowNode) => void): VNode {
  if (!node) {
    return h(
      'div',
      { style: { padding: '24px', color: '#999', textAlign: 'center' } },
      '点击节点查看属性',
    )
  }

  const labelStyle = {
    fontSize: '13px',
    color: '#666',
    marginBottom: '4px',
    display: 'block' as const,
  }
  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  }

  return h('div', { style: { padding: '16px' } }, [
    h('h4', { style: { margin: '0 0 16px', fontSize: '14px' } }, `属性 - ${node.name}`),
    h('div', { style: { marginBottom: '12px' } }, [
      h('label', { style: labelStyle }, '节点名称'),
      h('input', {
        style: inputStyle,
        value: node.name,
        onInput: (e: Event) => {
          node.name = (e.target as HTMLInputElement).value
          onUpdate(node)
        },
      }),
    ]),
    node.type === 'approve'
      ? h('div', { style: { marginBottom: '12px' } }, [
          h('label', { style: labelStyle }, '审批人类型'),
          h(
            'select',
            {
              style: { ...inputStyle, cursor: 'pointer' },
              value: node.assigneeType || 'user',
              onChange: (e: Event) => {
                node.assigneeType = (e.target as HTMLSelectElement)
                  .value as FlowNode['assigneeType']
                onUpdate(node)
              },
            },
            [
              h('option', { value: 'user' }, '指定用户'),
              h('option', { value: 'role' }, '指定角色'),
              h('option', { value: 'self' }, '发起人自选'),
              h('option', { value: 'leader' }, '部门负责人'),
            ],
          ),
        ])
      : null,
  ])
}

// --- Main component ---
export const SimpleFlowDesigner = defineComponent({
  name: 'SimpleFlowDesigner',
  props: {
    data: { type: Object as PropType<FlowData>, default: undefined },
    height: { type: Number, default: 500 },
  },
  emits: ['update:data', 'change'],
  setup(props, { emit }) {
    const flowData = ref<FlowNode>(props.data?.nodes || createDefaultFlow())
    const selectedId = ref<string | null>(null)

    function findNode(root: FlowNode, id: string): FlowNode | null {
      if (root.id === id) return root
      if (root.children) {
        for (const child of root.children) {
          const found = findNode(child, id)
          if (found) return found
        }
      }
      return null
    }

    function selectNode(id: string) {
      selectedId.value = selectedId.value === id ? null : id
    }

    function addNode(parentId: string, type: FlowNode['type']) {
      const parent = findNode(flowData.value, parentId)
      if (!parent) return
      if (!parent.children) parent.children = []

      const names: Record<string, string> = {
        approve: '审批人',
        condition: '条件分支',
        cc: '抄送人',
        delay: '延时等待',
      }

      const newNode: FlowNode = {
        id: genId(),
        type,
        name: names[type] || '新节点',
        children: [{ id: genId(), type: 'end', name: '结束' }],
      }

      // Insert before the end node if exists
      const endIdx = parent.children.findIndex((c) => c.type === 'end')
      if (endIdx >= 0) {
        parent.children.splice(endIdx, 0, newNode)
      } else {
        parent.children.push(newNode)
      }

      selectedId.value = newNode.id
      emitChange()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function updateNode(_node: FlowNode) {
      emitChange()
    }

    function emitChange() {
      const data: FlowData = { nodes: flowData.value }
      emit('update:data', data)
      emit('change', data)
    }

    function getData(): FlowData {
      return { nodes: flowData.value }
    }

    return {
      flowData,
      selectedId,
      selectNode,
      addNode,
      updateNode,
      getData,
    }
  },
  render() {
    const selectedNode = this.selectedId
      ? (() => {
          function find(root: FlowNode, id: string): FlowNode | null {
            if (root.id === id) return root
            if (root.children) {
              for (const c of root.children) {
                const f = find(c, id)
                if (f) return f
              }
            }
            return null
          }
          return find(this.flowData, this.selectedId)
        })()
      : null

    return h(
      'div',
      {
        class: 'simple-flow-designer',
        style: {
          display: 'flex',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          overflow: 'hidden',
          height: `${this.height}px`,
          background: '#fafafa',
        },
      },
      [
        // Canvas area
        h(
          'div',
          {
            style: {
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
          },
          [
            renderBranch(this.flowData, this.selectedId, this.selectNode, this.addNode),
            h('div', { style: { marginTop: '16px' } }, [
              renderAddButtons(this.selectedId, this.addNode),
            ]),
          ],
        ),
        // Properties panel
        h(
          'div',
          {
            style: {
              width: '280px',
              borderLeft: '1px solid #e8e8e8',
              background: '#fff',
              overflow: 'auto',
            },
          },
          [renderPropertiesPanel(selectedNode, this.updateNode)],
        ),
      ],
    )
  },
})
