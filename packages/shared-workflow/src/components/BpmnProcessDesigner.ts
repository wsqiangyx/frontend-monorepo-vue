import { defineComponent, h, ref, onMounted, onUnmounted, watch, type PropType } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import type { BpmnModel } from '../core/types'

const DEFAULT_BPMN = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="开始" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="160" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`

export const BpmnProcessDesigner = defineComponent({
  name: 'BpmnProcessDesigner',
  props: {
    xml: { type: String, default: '' },
    height: { type: Number, default: 500 },
    readOnly: { type: Boolean, default: false },
    onSaved: { type: Function as PropType<(model: BpmnModel) => void>, default: undefined },
  },
  emits: ['saved', 'error', 'ready'],
  setup(props, { emit }) {
    const containerRef = ref<HTMLElement>()
    let modeler: InstanceType<typeof BpmnModeler> | null = null

    async function initModeler() {
      if (!containerRef.value) return
      try {
        modeler = new BpmnModeler({
          container: containerRef.value,
          additionalModules: [],
          moddleExtensions: {},
        })
        const xml = props.xml || DEFAULT_BPMN
        await modeler.importXML(xml)
        const canvas = modeler.get('canvas') as { zoom: (level: string) => void }
        canvas.zoom('fit-viewport')
        emit('ready', modeler)
      } catch (err) {
        emit('error', err)
      }
    }

    async function getXML(): Promise<string> {
      if (!modeler) return ''
      const { xml } = await (
        modeler as unknown as { saveXML: (opts: { format: boolean }) => Promise<{ xml: string }> }
      ).saveXML({ format: true })
      return xml
    }

    async function getSVG(): Promise<string> {
      if (!modeler) return ''
      const { svg } = await (
        modeler as unknown as { saveSVG: () => Promise<{ svg: string }> }
      ).saveSVG()
      return svg
    }

    async function save() {
      const xml = await getXML()
      const model: BpmnModel = { xml }
      emit('saved', model)
      props.onSaved?.(model)
    }

    onMounted(initModeler)

    onUnmounted(() => {
      modeler?.destroy()
      modeler = null
    })

    watch(
      () => props.xml,
      async (newXml) => {
        if (modeler && newXml) {
          try {
            await modeler.importXML(newXml)
            const canvas = modeler.get('canvas') as { zoom: (level: string) => void }
            canvas.zoom('fit-viewport')
          } catch (err) {
            emit('error', err)
          }
        }
      },
    )

    return { containerRef, getXML, getSVG, save }
  },
  render() {
    return h('div', { class: 'bpmn-process-designer' }, [
      h('div', {
        ref: 'containerRef',
        class: 'bpmn-canvas',
        style: { height: `${this.height}px`, border: '1px solid var(--component-border, #e8e8e8)' },
      }),
    ])
  },
})
