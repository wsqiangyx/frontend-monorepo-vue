import { defineComponent, h, ref, onMounted, onUnmounted, watch, type PropType } from 'vue'
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'

export const BpmnProcessViewer = defineComponent({
  name: 'BpmnProcessViewer',
  props: {
    xml: { type: String, required: true },
    height: { type: Number, default: 400 },
    highlightNodes: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['error', 'ready'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement>()
    let viewer: InstanceType<typeof BpmnViewer> | null = null

    async function initView() {
      if (!containerRef.value || !props.xml) return
      try {
        viewer = new BpmnViewer({ container: containerRef.value })
        await viewer.importXML(props.xml)
        const canvas = viewer.get('canvas') as {
          zoom: (level: string) => void
          addMarker: (id: string, cls: string) => void
        }
        canvas.zoom('fit-viewport')
        // Highlight active nodes
        for (const nodeId of props.highlightNodes) {
          try {
            canvas.addMarker(nodeId, 'highlight')
          } catch {
            // Node may not exist in diagram
          }
        }
        emit('ready', viewer)
      } catch (err) {
        emit('error', err)
      }
    }

    onMounted(initView)

    onUnmounted(() => {
      viewer?.destroy()
      viewer = null
    })

    watch(
      () => props.xml,
      async (newXml) => {
        if (viewer && newXml) {
          try {
            await viewer.importXML(newXml)
            const canvas = viewer.get('canvas') as {
              zoom: (level: string) => void
              addMarker: (id: string, cls: string) => void
            }
            canvas.zoom('fit-viewport')
            for (const nodeId of props.highlightNodes) {
              try {
                canvas.addMarker(nodeId, 'highlight')
              } catch {
                // ignore
              }
            }
          } catch (err) {
            emit('error', err)
          }
        }
      },
    )

    return { containerRef }
  },
  render() {
    return h('div', { class: 'bpmn-process-viewer' }, [
      h('div', {
        ref: 'containerRef',
        class: 'bpmn-canvas',
        style: { height: `${this.height}px`, border: '1px solid var(--component-border, #e8e8e8)' },
      }),
    ])
  },
})
