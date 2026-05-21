import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TagView {
  path: string
  name?: string
  title: string
  affix?: boolean
  query?: Record<string, string>
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<Set<string>>(new Set())

  function addView(view: TagView) {
    addVisitedView(view)
    addCachedView(view)
  }

  function addVisitedView(view: TagView) {
    if (visitedViews.value.some((v) => v.path === view.path)) return
    visitedViews.value.push(view)
  }

  function addCachedView(view: TagView) {
    if (!view.name) return
    cachedViews.value.add(view.name)
  }

  function removeView(view: TagView) {
    const index = visitedViews.value.findIndex((v) => v.path === view.path)
    if (index !== -1) {
      visitedViews.value.splice(index, 1)
    }
    if (view.name) {
      cachedViews.value.delete(view.name)
    }
  }

  function removeOtherViews(view: TagView) {
    visitedViews.value = visitedViews.value.filter((v) => v.affix || v.path === view.path)
    cachedViews.value.clear()
    if (view.name) {
      cachedViews.value.add(view.name)
    }
  }

  function removeAllViews() {
    visitedViews.value = visitedViews.value.filter((v) => v.affix)
    cachedViews.value.clear()
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    addVisitedView,
    addCachedView,
    removeView,
    removeOtherViews,
    removeAllViews,
  }
})
