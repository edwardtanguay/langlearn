<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { BoltIcon, PencilSquareIcon, PencilIcon, PlusIcon, TrashIcon, CheckIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'

useHead({
  title: 'LangLearn - About & Roadmap',
  meta: [
    { name: 'description', content: 'LangLearn integrates modern, no-cost tools like Google Translate and AI search into your language learning flow to help you learn languages faster and with a self-directed, personal approach.' }
  ]
})

interface VersionCategoryAbbreviation {
  id: string
  versionCategoryId: string
  abbreviationText: string
}

interface VersionCategory {
  id: string
  title: string
  rank?: number
  abbreviations?: VersionCategoryAbbreviation[]
}

interface VersionItem {
  id: string
  versionId: string | null
  versionCategoryId?: string | null
  versionCategory?: VersionCategory | null
  type: 'FEATURE' | 'BUGFIX'
  body: string
  rank?: number
  orderWithinVersion: number
}

interface Version {
  id: string
  versionNumber: string
  title?: string | null
  status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE_VERSION' | 'INCOMING' | 'PROPOSED_ITEMS'
  publishDate?: string | null
  versionItems: VersionItem[]
}

const versions = ref<Version[]>([])
const unassignedItems = ref<VersionItem[]>([])
const categories = ref<VersionCategory[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const isAdmin = ref(false)
const adminEditMode = ref(false)
const versionSaveError = ref('')
const categorySaveError = ref('')
const searchQuery = ref('')

// Edit Modals for Admin
const showEditItemModal = ref(false)
const editingItem = ref<{ id: string; versionId: string; versionCategoryId: string; afterItemId: string; body: string; type: 'FEATURE' | 'BUGFIX'; rank: number }>({
  id: '', versionId: 'none', versionCategoryId: '', afterItemId: '', body: '', type: 'BUGFIX', rank: 2.5
})
const itemRankStr = ref('2.5')
const isNewItem = ref(false)

const showEditVersionModal = ref(false)
const editingVersion = ref<{ id: string; versionNumber: string; title: string; status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE_VERSION'; publishDate: string }>({
  id: '', versionNumber: '', title: '', status: 'IN_PROGRESS', publishDate: ''
})
const isNewVersion = ref(false)

// Category Edit Modal
const showCategoryModal = ref(false)
const isNewCategory = ref(false)
const editingCategory = ref<{ id: string; title: string; rank: number; abbreviations: string }>({
  id: '', title: '', rank: 2.5, abbreviations: ''
})
const categoryRankStr = ref('2.5')

const focusFirstModalInput = () => {
  nextTick(() => {
    if (typeof document !== 'undefined') {
      const firstInput = document.querySelector('.fixed.inset-0 input:not([type="hidden"]), .fixed.inset-0 textarea, .fixed.inset-0 select') as HTMLElement | null
      if (firstInput) {
        firstInput.focus()
      }
    }
  })
}

const checkMobileView = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    adminEditMode.value = false
  }
}

const handleRankInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const cleaned = input.value.replace(/,/g, '')
  categoryRankStr.value = cleaned
  input.value = cleaned
  editingCategory.value.rank = parseFloat(cleaned) || 0
}

const handleItemRankInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const cleaned = input.value.replace(/,/g, '')
  itemRankStr.value = cleaned
  input.value = cleaned
  editingItem.value.rank = parseFloat(cleaned) || 2.5
}

const loadData = async (showLoading = false) => {
  if (showLoading || versions.value.length === 0) {
    isLoading.value = true
  }
  try {
    const data = await $fetch<{ versions: Version[]; unassignedItems: VersionItem[]; categories: VersionCategory[] }>('/api/versions/public')
    versions.value = data.versions || []
    unassignedItems.value = data.unassignedItems || []
    categories.value = data.categories || []

    try {
      const me = await $fetch<{ role: string }>('/api/user/me')
      if (me?.role === 'admin') {
        isAdmin.value = true
      }
    } catch {
      isAdmin.value = false
    }
  } catch (err) {
    console.error('Failed to load versions history:', err)
  } finally {
    isLoading.value = false
  }
}

function shouldShowVersionDropdown(item: VersionItem, ver: Version): boolean {
  const isIncoming = ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0' || !item.versionId || item.versionId === 'none'
  if (!isIncoming) return true

  const catObj = item.versionCategory || categories.value.find(c => c.id === item.versionCategoryId)
  const catTitle = catObj?.title || ''
  if (catTitle.toLowerCase() === 'clean and assign') {
    return false
  }
  return true
}

const nuxtApp = useNuxtApp()
let removeHookListener: (() => void) | null = null

onMounted(() => {
  checkMobileView()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkMobileView)
  }
  loadData(true)

  // Listen for newly added ideas from QuickAddIdeaDrawer
  removeHookListener = nuxtApp.hook('idea-added' as any, (newItem: VersionItem) => {
    if (newItem) {
      const exists = unassignedItems.value.some(i => i.id === newItem.id)
      if (!exists) {
        unassignedItems.value.unshift(newItem)
      }
    }
    loadData(false)
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobileView)
  }
  if (removeHookListener) {
    removeHookListener()
  }
})

// Helper to compare SemVer strings in descending order
function compareSemVerDesc(v1: string, v2: string): number {
  const p1 = v1.split('.').map(n => parseInt(n, 10))
  const p2 = v2.split('.').map(n => parseInt(n, 10))
  const maxLen = Math.max(p1.length, p2.length)
  for (let i = 0; i < maxLen; i++) {
    const num1 = p1[i] ?? 0
    const num2 = p2[i] ?? 0
    if (num1 !== num2) return num2 - num1
  }
  return 0
}

const displayedVersions = computed(() => {
  if (!adminEditMode.value) {
    // Admin mode OFF: show ONLY PUBLISHED versions with at least one item, descending by version number
    return versions.value
      .filter(v => v.status === 'PUBLISHED' && v.versionItems.length > 0)
      .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
  }

  // Admin mode ON:
  // 1. FUTURE versions in descending version order
  // 2. INCOMING version (0.0.0)
  // 3. PUBLISHED and IN_PROGRESS versions in descending version order
  const futureVers = versions.value
    .filter(v => v.status === 'FUTURE_VERSION')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))

  const incomingVer = versions.value.filter(v => v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0')

  const activeVers = versions.value
    .filter(v => v.status === 'PUBLISHED' || v.status === 'IN_PROGRESS')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))

  return [...futureVers, ...incomingVer, ...activeVers]
})

const isSearchActive = computed(() => searchQuery.value.trim().length > 0)

const versionsForDisplay = computed(() => {
  const base = displayedVersions.value
  if (!isSearchActive.value) return base
  const q = searchQuery.value.toLowerCase().trim()
  return base
    .map(v => ({
      ...v,
      versionItems: v.versionItems.filter(item => item.body.toLowerCase().includes(q))
    }))
    .filter(v => v.versionItems.length > 0)
})

// Sorted categories for dropdowns: General first, then by descending rank
const sortedCategoriesForDropdown = computed(() => {
  const generalCat = categories.value.find(c => c.title === 'General')
  const cleanAssignCat = categories.value.find(c => c.title === 'Clean and assign')
  const rest = categories.value
    .filter(c => c.title !== 'General' && c.title !== 'Clean and assign')
    .sort((a, b) => (b.rank ?? 2.5) - (a.rank ?? 2.5))
  return [
    ...(cleanAssignCat ? [cleanAssignCat] : []),
    ...(generalCat ? [generalCat] : []),
    ...rest
  ]
})

// Sorted versions for dropdowns: mirrors displayedVersions order (FUTURE → INCOMING → PUBLISHED/IN_PROGRESS)
function getVersionsForDropdown(excludeId?: string | null): Version[] {
  const futureVers = versions.value
    .filter(v => v.status === 'FUTURE_VERSION')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
  const incomingVer = versions.value.filter(v => v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0')
  const activeVers = versions.value
    .filter(v => v.status === 'PUBLISHED' || v.status === 'IN_PROGRESS')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
  return [...futureVers, ...incomingVer, ...activeVers].filter(v => v.versionNumber !== '0.0.0' && v.id !== excludeId)
}

interface CategoryGroup {
  categoryId: string
  categoryTitle: string
  categoryRank: number
  items: VersionItem[]
}

function sortItemsByRankAndType(items: VersionItem[]): VersionItem[] {
  return [...items].sort((a, b) => {
    const rankA = a.rank ?? 2.5
    const rankB = b.rank ?? 2.5
    if (rankB !== rankA) return rankB - rankA
    if (a.type === 'FEATURE' && b.type === 'BUGFIX') return -1
    if (a.type === 'BUGFIX' && b.type === 'FEATURE') return 1
    return 0
  })
}

function getGroupedItemsForVersion(items: VersionItem[]): { isAllGeneral: boolean; groups: CategoryGroup[]; allItems: VersionItem[] } {
  if (!items || items.length === 0) {
    return { isAllGeneral: true, groups: [], allItems: [] }
  }

  const generalCat = categories.value.find(c => c.title === 'General')
  const generalId = generalCat?.id

  const isAllGeneral = items.every(item => {
    if (!item.versionCategoryId) return true
    if (generalId && item.versionCategoryId === generalId) return true
    return item.versionCategory?.title === 'General'
  })

  if (isAllGeneral) {
    return { isAllGeneral: true, groups: [], allItems: sortItemsByRankAndType(items) }
  }

  const groupsMap = new Map<string, { categoryTitle: string; categoryRank: number; items: VersionItem[] }>()

  for (const item of items) {
    const catObj = categories.value.find(c => c.id === item.versionCategoryId) || item.versionCategory
    const catTitle = catObj?.title || 'General'
    const catId = item.versionCategoryId || generalId || 'general'
    const catRank = catObj?.rank ?? 2.5

    if (!groupsMap.has(catId)) {
      groupsMap.set(catId, { categoryTitle: catTitle, categoryRank: catRank, items: [] })
    }
    groupsMap.get(catId)!.items.push(item)
  }

  const resultGroups: CategoryGroup[] = []

  // 1. Clean and assign category goes first
  let cleanAssignKey: string | null = null
  for (const [key, group] of groupsMap.entries()) {
    if (group.categoryTitle === 'Clean and assign') {
      cleanAssignKey = key
      break
    }
  }
  if (cleanAssignKey) {
    const grp = groupsMap.get(cleanAssignKey)!
    resultGroups.push({ categoryId: cleanAssignKey, categoryTitle: grp.categoryTitle, categoryRank: grp.categoryRank, items: sortItemsByRankAndType(grp.items) })
    groupsMap.delete(cleanAssignKey)
  }

  // 2. GENERAL category goes second
  let generalKey: string | null = null
  for (const [key, group] of groupsMap.entries()) {
    if (group.categoryTitle === 'General') {
      generalKey = key
      break
    }
  }
  if (generalKey) {
    const grp = groupsMap.get(generalKey)!
    resultGroups.push({ categoryId: generalKey, categoryTitle: grp.categoryTitle, categoryRank: grp.categoryRank, items: sortItemsByRankAndType(grp.items) })
    groupsMap.delete(generalKey)
  }

  // 3. All other categories listed in descending rank order
  const restSorted = Array.from(groupsMap.entries()).sort((a, b) => {
    const rankDiff = b[1].categoryRank - a[1].categoryRank
    if (rankDiff !== 0) return rankDiff
    return a[1].categoryTitle.localeCompare(b[1].categoryTitle)
  })

  for (const [key, group] of restSorted) {
    resultGroups.push({
      categoryId: key,
      categoryTitle: group.categoryTitle,
      categoryRank: group.categoryRank,
      items: sortItemsByRankAndType(group.items)
    })
  }

  return { isAllGeneral: false, groups: resultGroups, allItems: sortItemsByRankAndType(items) }
}

function calculateNextVersionNumber(): string {
  const validVers = versions.value.filter(v => v.versionNumber !== '0.0.0' && v.status !== 'INCOMING' && v.status !== 'PROPOSED_ITEMS' && v.status !== 'FUTURE_VERSION')
  if (validVers.length === 0) return '0.1.0'

  const sorted = [...validVers].sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
  const latest = sorted[0]?.versionNumber || '0.13.0'

  const parts = latest.split('.').map(n => parseInt(n, 10))
  const major = parts[0] ?? 0
  const minor = parts[1] ?? 0
  return `${major}.${minor + 1}.0`
}

function formatSentenceCase(str: string | null | undefined): string {
  if (!str) return ''
  const trimmed = str.trim()
  if (!trimmed) return ''
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function formatPublishDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0] ?? ''
}

function getRelativeDateStr(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  const pubDate = new Date(dateStr)
  if (isNaN(pubDate.getTime())) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(pubDate)
  target.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - target.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '(today)'
  if (diffDays === 1) return '(yesterday)'
  if (diffDays > 1) return `(${diffDays} days ago)`
  if (diffDays < 0) return `(in ${Math.abs(diffDays)} days)`
  return ''
}

const openAddVersion = () => {
  isNewVersion.value = true
  versionSaveError.value = ''
  const todayStr = new Date().toISOString().split('T')[0] ?? ''
  editingVersion.value = {
    id: '',
    versionNumber: calculateNextVersionNumber(),
    title: '',
    status: 'IN_PROGRESS',
    publishDate: todayStr
  }
  showEditVersionModal.value = true
  focusFirstModalInput()
}

const openEditVersion = (ver: Version) => {
  if (ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') return
  isNewVersion.value = false
  versionSaveError.value = ''
  const formattedDate = formatPublishDate(ver.publishDate)
  editingVersion.value = { id: ver.id, versionNumber: ver.versionNumber, title: ver.title || '', status: ver.status as any, publishDate: formattedDate }
  showEditVersionModal.value = true
  focusFirstModalInput()
}

const saveAdminVersion = async () => {
  versionSaveError.value = ''
  const vNum = editingVersion.value.versionNumber.trim()
  if (!vNum) {
    versionSaveError.value = 'Version number is required'
    return
  }

  if (vNum === '0.0.0') {
    versionSaveError.value = 'version number already taken'
    return
  }

  const duplicate = versions.value.find(v => v.versionNumber === vNum && (isNewVersion.value || v.id !== editingVersion.value.id))
  if (duplicate) {
    versionSaveError.value = 'version number already taken'
    return
  }

  const payload = { ...editingVersion.value, versionNumber: vNum }
  const snapshot = JSON.parse(JSON.stringify(versions.value))

  // Optimistic update & immediate smooth close
  if (!isNewVersion.value) {
    const existing = versions.value.find(v => v.id === editingVersion.value.id)
    if (existing) {
      existing.versionNumber = payload.versionNumber
      existing.title = payload.title
      existing.status = payload.status
      existing.publishDate = payload.publishDate
    }
  }
  showEditVersionModal.value = false

  try {
    if (isNewVersion.value) {
      await $fetch<Version>('/api/dev/versions', {
        method: 'POST',
        body: payload
      })
    } else {
      await $fetch<Version>(`/api/dev/versions/${editingVersion.value.id}`, {
        method: 'PUT',
        body: payload
      })
    }
    await loadData(false)
  } catch (err: any) {
    versions.value = snapshot
    alert(err.data?.statusMessage || err.message || 'Failed to save version')
  }
}

const deleteVersion = async (ver: Version) => {
  if (ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') return
  if (!confirm(`Are you sure you want to delete version ${ver.versionNumber}?`)) return
  const snapshot = JSON.parse(JSON.stringify(versions.value))
  versions.value = versions.value.filter(v => v.id !== ver.id)
  try {
    await $fetch(`/api/dev/versions/${ver.id}`, { method: 'DELETE' })
    await loadData(false)
  } catch (err: any) {
    versions.value = snapshot
    alert(err.data?.statusMessage || 'Failed to delete version')
  }
}

const openAddItem = (versionId: string | null, afterItemId?: string, sourceItem?: VersionItem) => {
  isNewItem.value = true
  if (sourceItem) {
    // Copy type, category, version, and rank from clicked item (rank slightly lower)
    const sourceRank = sourceItem.rank ?? 2.5
    const randomOffset = (Math.floor(Math.random() * 800) + 100) / 10000 // 0.01 to 0.09
    const newRank = Math.max(0, parseFloat((sourceRank - randomOffset).toFixed(5)))
    itemRankStr.value = newRank.toString()
    editingItem.value = {
      id: '',
      versionId: sourceItem.versionId || versionId || 'none',
      versionCategoryId: sourceItem.versionCategoryId || '',
      afterItemId: afterItemId || '',
      body: '',
      type: sourceItem.type,
      rank: newRank
    }
  } else {
    const cleanAssignCat = categories.value.find(c => c.title.toLowerCase() === 'clean and assign')
    const defaultCatId = cleanAssignCat?.id || categories.value[0]?.id || ''
    itemRankStr.value = '2.5'
    editingItem.value = {
      id: '',
      versionId: versionId || 'none',
      versionCategoryId: defaultCatId,
      afterItemId: afterItemId || '',
      body: '',
      type: 'BUGFIX',
      rank: 2.5
    }
  }
  showEditItemModal.value = true
  focusFirstModalInput()
}

const openEditItem = (item: VersionItem) => {
  isNewItem.value = false
  const rankVal = item.rank ?? 2.5
  itemRankStr.value = rankVal.toString()
  editingItem.value = {
    id: item.id,
    versionId: item.versionId || 'none',
    versionCategoryId: item.versionCategoryId || '',
    afterItemId: '',
    body: item.body,
    type: item.type,
    rank: rankVal
  }
  showEditItemModal.value = true
  focusFirstModalInput()
}

const handleItemCategoryChange = (event: Event) => {
  const val = (event.target as HTMLSelectElement).value
  if (val === 'NEW_CATEGORY') {
    openAddCategory()
  }
}

const saveAdminItem = async () => {
  if (!editingItem.value.body.trim()) return
  const targetRank = Math.max(0, Math.min(5, parseFloat(itemRankStr.value) || 2.5))
  editingItem.value.rank = targetRank

  const payload = {
    ...editingItem.value,
    versionId: editingItem.value.versionId === 'none' ? null : editingItem.value.versionId,
    versionCategoryId: editingItem.value.versionCategoryId || null
  }

  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Optimistic update & immediate smooth close
  if (!isNewItem.value) {
    const targetCat = categories.value.find(c => c.id === payload.versionCategoryId) || null

    let found: VersionItem | undefined = undefined
    let parentVer: Version | undefined = undefined

    for (const v of versions.value) {
      const idx = v.versionItems.findIndex(i => i.id === payload.id)
      if (idx !== -1) {
        found = v.versionItems[idx]
        parentVer = v
        break
      }
    }
    if (!found) {
      found = unassignedItems.value.find(i => i.id === payload.id)
    }

    if (found) {
      found.body = payload.body
      found.type = payload.type
      found.rank = payload.rank
      found.versionCategoryId = payload.versionCategoryId
      found.versionCategory = targetCat

      // Move item container if version changed
      if (found.versionId !== payload.versionId) {
        // Remove from old location
        if (parentVer) {
          parentVer.versionItems = parentVer.versionItems.filter(i => i.id !== payload.id)
        } else {
          unassignedItems.value = unassignedItems.value.filter(i => i.id !== payload.id)
        }
        found.versionId = payload.versionId
        // Add to new location
        if (payload.versionId === null) {
          unassignedItems.value.push(found)
        } else {
          const targetVer = versions.value.find(v => v.id === payload.versionId)
          if (targetVer) {
            targetVer.versionItems = [...targetVer.versionItems, found]
          }
        }
      } else if (parentVer) {
        // Force Vue reactivity trigger for getGroupedItemsForVersion
        parentVer.versionItems = [...parentVer.versionItems]
      }
    }
  } else {
    const tempId = `temp-${Date.now()}`
    const targetCat = categories.value.find(c => c.id === payload.versionCategoryId) || null
    const newItemObj: VersionItem = {
      id: tempId,
      versionId: payload.versionId,
      versionCategoryId: payload.versionCategoryId,
      versionCategory: targetCat,
      type: payload.type,
      body: payload.body,
      rank: payload.rank,
      orderWithinVersion: 0
    }
    if (!payload.versionId) {
      const incomingVer = versions.value.find(v => v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0')
      if (incomingVer) {
        incomingVer.versionItems.unshift(newItemObj)
      }
      unassignedItems.value.unshift(newItemObj)
    } else {
      const targetVer = versions.value.find(v => v.id === payload.versionId)
      if (targetVer) {
        targetVer.versionItems.unshift(newItemObj)
      }
    }
  }

  showEditItemModal.value = false

  try {
    if (isNewItem.value) {
      const created = await $fetch<VersionItem>('/api/dev/version-items', {
        method: 'POST',
        body: payload
      })
      if (created?.id) {
        if (!payload.versionId) {
          const item = unassignedItems.value.find(i => i.body === payload.body)
          if (item) item.id = created.id
        } else {
          const targetVer = versions.value.find(v => v.id === payload.versionId)
          const item = targetVer?.versionItems.find(i => i.body === payload.body)
          if (item) item.id = created.id
        }
      }
    } else {
      const updated = await $fetch<VersionItem>(`/api/dev/version-items/${payload.id}`, {
        method: 'PUT',
        body: payload
      })
      if (updated) {
        for (const v of versions.value) {
          const item = v.versionItems.find(i => i.id === payload.id)
          if (item) {
            item.body = updated.body
            item.versionCategoryId = updated.versionCategoryId
            item.versionCategory = updated.versionCategory || categories.value.find(c => c.id === updated.versionCategoryId) || null
            v.versionItems = [...v.versionItems]
            break
          }
        }
      }
    }
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    alert(err.data?.statusMessage || 'Failed to save item')
  }
}

const updateItemCategoryDirectly = async (item: VersionItem, categoryId: string, event?: Event) => {
  if (event?.target) {
    (event.target as HTMLSelectElement).value = ''
  }
  if (!categoryId || categoryId === item.versionCategoryId) return
  if (categoryId === 'NEW_CATEGORY') {
    openAddCategory()
    return
  }
  const oldCatId = item.versionCategoryId
  const oldCatObj = item.versionCategory
  const newCat = categories.value.find(c => c.id === categoryId) || null

  // Optimistic update
  item.versionCategoryId = categoryId || null
  item.versionCategory = newCat

  try {
    await $fetch(`/api/dev/version-items/${item.id}`, {
      method: 'PUT',
      body: { versionCategoryId: categoryId || null }
    })
    await loadData(false)
  } catch (err: any) {
    item.versionCategoryId = oldCatId
    item.versionCategory = oldCatObj
    alert(err.data?.statusMessage || 'Failed to update item category')
  }
}

const updateItemVersionDirectly = async (item: VersionItem, versionId: string, event?: Event) => {
  if (event?.target) {
    (event.target as HTMLSelectElement).value = ''
  }
  if (versionId === 'NEW_VERSION') {
    openAddVersion()
    return
  }
  const targetVerId = (versionId === 'none' || versionId === '') ? null : versionId
  const oldVerId = item.versionId
  if (oldVerId === targetVerId) return

  // Optimistic update
  item.versionId = targetVerId

  // Move item between version containers in reactive state
  if (oldVerId !== targetVerId) {
    // Remove from old location
    if (oldVerId === null) {
      unassignedItems.value = unassignedItems.value.filter(i => i.id !== item.id)
    } else {
      const oldVer = versions.value.find(v => v.id === oldVerId)
      if (oldVer) {
        oldVer.versionItems = oldVer.versionItems.filter(i => i.id !== item.id)
      }
    }
    // Add to new location
    if (targetVerId === null) {
      unassignedItems.value.push(item)
    } else {
      const targetVer = versions.value.find(v => v.id === targetVerId)
      if (targetVer) {
        targetVer.versionItems.push(item)
      }
    }
  }

  try {
    await $fetch(`/api/dev/version-items/${item.id}`, {
      method: 'PUT',
      body: { versionId: targetVerId }
    })
  } catch (err: any) {
    await loadData(false)
    alert(err.data?.statusMessage || 'Failed to update item version')
  }
}

const handleItemMoreAction = (action: string, item: VersionItem, verId: string | null) => {
  if (!action) return
  if (action === 'edit') {
    openEditItem(item)
  } else if (action === 'add_item') {
    openAddItem(verId, item.id)
  } else if (action === 'delete') {
    deleteItem(item)
  }
}

const moveCategoryItemsToVersion = async (categoryId: string, sourceVersionId: string | null, targetVersionId: string) => {
  if (!targetVersionId) return
  const finalTargetVerId = (targetVersionId === 'none' || targetVersionId === '') ? null : targetVersionId
  const finalSourceVerId = (sourceVersionId === 'none' || sourceVersionId === '') ? null : sourceVersionId

  if (finalSourceVerId === finalTargetVerId) return

  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Collect matching items only from the specific source version
  const matchingItems: VersionItem[] = []
  if (finalSourceVerId === null) {
    unassignedItems.value.forEach(i => {
      if (i.versionCategoryId === categoryId) matchingItems.push(i)
    })
  } else {
    const srcVer = versions.value.find(v => v.id === finalSourceVerId)
    if (srcVer) {
      srcVer.versionItems.forEach(i => {
        if (i.versionCategoryId === categoryId) matchingItems.push(i)
      })
    }
  }

  if (matchingItems.length === 0) return

  // Optimistically move matching items to target version
  matchingItems.forEach(item => {
    item.versionId = finalTargetVerId
  })

  // Re-group reactive arrays
  if (finalSourceVerId === null) {
    unassignedItems.value = unassignedItems.value.filter(i => i.versionCategoryId !== categoryId)
  } else {
    const srcVer = versions.value.find(v => v.id === finalSourceVerId)
    if (srcVer) {
      srcVer.versionItems = srcVer.versionItems.filter(i => i.versionCategoryId !== categoryId)
    }
  }

  if (finalTargetVerId === null) {
    unassignedItems.value = [...unassignedItems.value, ...matchingItems]
  } else {
    const tgtVer = versions.value.find(v => v.id === finalTargetVerId)
    if (tgtVer) {
      tgtVer.versionItems = [...tgtVer.versionItems, ...matchingItems]
    }
  }

  try {
    await $fetch('/api/dev/version-items/move-category', {
      method: 'POST',
      body: { versionCategoryId: categoryId, sourceVersionId: finalSourceVerId, targetVersionId: finalTargetVerId }
    })
    await loadData(false)
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    alert(err.data?.statusMessage || 'Failed to move category items to version')
  }
}

const moveAllVersionItemsToVersion = async (sourceVersionId: string | null, targetVersionId: string) => {
  if (!targetVersionId) return
  const finalTargetVerId = (targetVersionId === 'none' || targetVersionId === '') ? null : targetVersionId
  const finalSourceVerId = (sourceVersionId === 'none' || sourceVersionId === '') ? null : sourceVersionId

  if (finalSourceVerId === finalTargetVerId) return

  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Collect all items from source version
  let matchingItems: VersionItem[] = []
  if (finalSourceVerId === null) {
    matchingItems = [...unassignedItems.value]
  } else {
    const srcVer = versions.value.find(v => v.id === finalSourceVerId)
    if (srcVer) {
      matchingItems = [...srcVer.versionItems]
    }
  }

  if (matchingItems.length === 0) return

  // Optimistically move all items to target version
  matchingItems.forEach(item => {
    item.versionId = finalTargetVerId
  })

  if (finalSourceVerId === null) {
    unassignedItems.value = []
  } else {
    const srcVer = versions.value.find(v => v.id === finalSourceVerId)
    if (srcVer) {
      srcVer.versionItems = []
    }
  }

  if (finalTargetVerId === null) {
    unassignedItems.value = [...unassignedItems.value, ...matchingItems]
  } else {
    const tgtVer = versions.value.find(v => v.id === finalTargetVerId)
    if (tgtVer) {
      tgtVer.versionItems = [...tgtVer.versionItems, ...matchingItems]
    }
  }

  try {
    await $fetch('/api/dev/version-items/move-all', {
      method: 'POST',
      body: { sourceVersionId: finalSourceVerId, targetVersionId: finalTargetVerId }
    })
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    alert(err.data?.statusMessage || 'Failed to move all items to version')
  }
}

const deleteItem = async (item: VersionItem) => {
  if (!confirm('Are you sure you want to delete this item?')) return
  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Optimistic update
  if (item.versionId === null) {
    unassignedItems.value = unassignedItems.value.filter(i => i.id !== item.id)
  } else {
    for (const v of versions.value) {
      v.versionItems = v.versionItems.filter(i => i.id !== item.id)
    }
  }

  try {
    await $fetch(`/api/dev/version-items/${item.id}`, { method: 'DELETE' })
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    alert(err.data?.statusMessage || 'Failed to delete item')
  }
}

// Category Management Functions
const openAddCategory = () => {
  isNewCategory.value = true
  categorySaveError.value = ''
  categoryRankStr.value = '2.5'
  editingCategory.value = { id: '', title: '', rank: 2.5, abbreviations: '' }
  showCategoryModal.value = true
  focusFirstModalInput()
}

const openEditCategory = (catId: string) => {
  const cat = categories.value.find(c => c.id === catId)
  if (!cat) return
  isNewCategory.value = false
  categorySaveError.value = ''
  const rankVal = cat.rank ?? 2.5
  categoryRankStr.value = rankVal.toString()
  const abbrList = (cat.abbreviations || []).map(a => a.abbreviationText).join(', ')
  editingCategory.value = { id: cat.id, title: cat.title, rank: rankVal, abbreviations: abbrList }
  showCategoryModal.value = true
  focusFirstModalInput()
}

const saveCategory = async () => {
  categorySaveError.value = ''
  const title = editingCategory.value.title.trim()
  if (!title) {
    categorySaveError.value = 'Category title is required'
    return
  }

  const rankVal = Math.max(0, Math.min(5, parseFloat(categoryRankStr.value) || 2.5))

  const abbrArray = editingCategory.value.abbreviations
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const snapshot = JSON.parse(JSON.stringify(categories.value))

  // Optimistic update & immediate smooth close
  if (!isNewCategory.value) {
    const existing = categories.value.find(c => c.id === editingCategory.value.id)
    if (existing) {
      existing.title = title
      existing.rank = rankVal
    }
  }

  showCategoryModal.value = false

  try {
    if (isNewCategory.value) {
      const created = await $fetch<VersionCategory>('/api/dev/categories', {
        method: 'POST',
        body: { title, rank: rankVal, abbreviations: abbrArray }
      })
      if (editingItem.value) {
        editingItem.value.versionCategoryId = created.id
      }
    } else {
      await $fetch(`/api/dev/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: { title, rank: rankVal, abbreviations: abbrArray }
      })
    }
    await loadData(false)
  } catch (err: any) {
    categories.value = snapshot
    categorySaveError.value = err.data?.statusMessage || err.message || 'Failed to save category'
  }
}

const deleteCategory = async () => {
  if (editingCategory.value.title === 'General' || editingCategory.value.title === 'Clean and assign') {
    alert(`The "${editingCategory.value.title}" category cannot be deleted`)
    return
  }
  if (!confirm(`Are you sure you want to delete category "${editingCategory.value.title}"? Assigned items will move to Clean and assign.`)) {
    return
  }
  const snapshot = JSON.parse(JSON.stringify(categories.value))
  categories.value = categories.value.filter(c => c.id !== editingCategory.value.id)
  showCategoryModal.value = false
  try {
    await $fetch(`/api/dev/categories/${editingCategory.value.id}`, {
      method: 'DELETE'
    })
    await loadData(false)
  } catch (err: any) {
    categories.value = snapshot
    categorySaveError.value = err.data?.statusMessage || 'Failed to delete category'
  }
}

// Issue Markdown Copy Generator
const copiedVersionId = ref<string | null>(null)
let copiedTimeout: ReturnType<typeof setTimeout> | null = null

function generateIssueMarkdown(ver: Version): string {
  const isIncoming = ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0'
  const isFuture = ver.status === 'FUTURE_VERSION'
  let titlePart: string
  if (isIncoming) {
    titlePart = 'Incoming Changes'
  } else if (isFuture) {
    titlePart = ver.title || 'Future Version'
  } else {
    titlePart = ver.title ? `v${ver.versionNumber} - ${ver.title}` : `v${ver.versionNumber}`
  }
  let md = `# ${titlePart}\n\n`
  md += `All todos in this issue are expressed in the past tense as if they have already been accomplished. The goal is to implement each bug-fix and feature to the extent that their text is 100% true of the app.\n\n`

  const grouped = getGroupedItemsForVersion(ver.versionItems)
  if (grouped.isAllGeneral) {
    if (grouped.allItems.length > 0) {
      md += `## General\n\n`
      for (const item of grouped.allItems) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        md += `- ${prefix}: ${formatSentenceCase(item.body)}\n`
      }
      md += `\n`
    }
  } else {
    for (const group of grouped.groups) {
      md += `## ${group.categoryTitle}\n\n`
      for (const item of group.items) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        md += `- ${prefix}: ${formatSentenceCase(item.body)}\n`
      }
      md += `\n`
    }
  }

  return md.trim()
}

async function copyIssueMarkdown(ver: Version) {
  const md = generateIssueMarkdown(ver)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(md)
    }
    copiedVersionId.value = ver.id
    if (copiedTimeout) clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => {
      copiedVersionId.value = null
    }, 2500)
  } catch (err) {
    console.error('Failed to copy to clipboard', err)
  }
}

// Item Rank Redistribution Handlers (UP / DOWN)
async function moveItemRank(item: VersionItem, direction: 'up' | 'down', list: VersionItem[]) {
  const currentIndex = list.findIndex(i => i.id === item.id)
  if (currentIndex === -1) return

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= list.length) return

  // Swap items in the list to update relative order within group
  const updatedGroupList = [...list]
  const temp = updatedGroupList[currentIndex]!
  updatedGroupList[currentIndex] = updatedGroupList[targetIndex]!
  updatedGroupList[targetIndex] = temp

  // Redistribute process: renumber ranks for items in this category group evenly
  const n = updatedGroupList.length
  const itemsToUpdate: { id: string; rank: number }[] = []

  updatedGroupList.forEach((itm, idx) => {
    const evenBase = n > 1 ? 5.0 - ((idx + 1) / (n + 1)) * 5.0 : 2.5
    const randomOffset = (Math.floor(Math.random() * 90000) + 10000) / 1000000
    const newRank = parseFloat((evenBase + randomOffset).toFixed(5))

    itm.rank = newRank
    itemsToUpdate.push({ id: itm.id, rank: newRank })
  })

  // Update item rank in the master versionItems or unassignedItems array without destroying other categories
  if (item.versionId) {
    const ver = versions.value.find(v => v.id === item.versionId)
    if (ver) {
      ver.versionItems = [...ver.versionItems]
    }
  } else {
    unassignedItems.value = [...unassignedItems.value]
  }

  // Persist new ranks to database via batch reorder API
  try {
    await $fetch('/api/dev/version-items/reorder', {
      method: 'POST',
      body: { items: itemsToUpdate }
    })
  } catch (err: any) {
    console.error('Failed to persist redistributed ranks:', err)
    await loadData(false)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10 px-4 min-h-[600px] space-y-12">
    <!-- 1. INTRODUCTORY HERO SECTION -->
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950 rounded-2xl p-6 md:p-8 text-white shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-8">
      <!-- Left: Fast Flashcards Symbol -->
      <div class="shrink-0 relative group flex items-center justify-center p-2">
        <div class="absolute -top-1 -right-1 z-10">
          <BoltIcon class="w-6 h-6 text-amber-400 animate-pulse drop-shadow-md" />
        </div>
        <svg class="w-24 h-24 transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cardGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.4" />
            </linearGradient>
            <linearGradient id="cardGradMid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ea580c" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#d97706" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="cardGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
            <linearGradient id="techLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#fef3c7" stop-opacity="0.4" />
            </linearGradient>
          </defs>

          <rect x="22" y="14" width="56" height="42" rx="8" fill="url(#cardGradBack)" transform="rotate(-12 50 35)" />
          <rect x="24" y="24" width="56" height="42" rx="8" fill="url(#cardGradMid)" transform="rotate(-4 52 45)" />
          <rect x="24" y="36" width="58" height="44" rx="8" fill="url(#cardGradFront)" class="drop-shadow-lg" />
          <rect x="32" y="46" width="28" height="5" rx="2.5" fill="url(#techLineGrad)" />
          <rect x="32" y="55" width="42" height="4" rx="2" fill="url(#techLineGrad)" opacity="0.75" />
          <rect x="32" y="63" width="20" height="4" rx="2" fill="url(#techLineGrad)" opacity="0.5" />
          <circle cx="68" cy="48.5" r="3.5" fill="#ffffff" opacity="0.9" />
        </svg>
      </div>

      <!-- Right: Text Description & Author Link -->
      <div class="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4 text-center md:text-left w-full">
        <div class="space-y-2 max-w-2xl">
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white">About LangLearn</h1>
          <p class="text-sm md:text-base text-gray-300 font-medium leading-relaxed">
            LangLearn integrates modern, no-cost tools like Google Translate and AI search into your language learning flow to help you learn languages faster and with a self-directed, personal approach.
          </p>
        </div>
        <div class="pt-1 md:pt-0 text-xs text-gray-400 font-medium shrink-0 md:text-right">
          More projects by <a href="https://tanguay.info" target="_blank" rel="noopener noreferrer" class="text-white underline hover:text-amber-300 transition-colors">Edward</a>
        </div>
      </div>
    </div>

    <!-- 2. VERSIONS DISPLAY -->
    <div class="space-y-6">
      <div class="flex items-start justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Version History</span>
        </h2>
        <div v-if="isAdmin" class="hidden md:flex items-center space-x-3">
          <button
            v-if="adminEditMode"
            @click="openAddVersion"
            class="px-2.5 py-1 text-xs text-gray-300 dark:text-gray-400 hover:text-white bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 transition-colors"
          >
            + New Version
          </button>
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs text-gray-400 select-none">
            <input
              type="checkbox"
              v-model="adminEditMode"
              class="sr-only peer"
            />
            <div class="relative w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
            <span class="font-medium" :class="adminEditMode ? 'text-white' : 'text-gray-400'">Admin mode</span>
          </label>
        </div>
      </div>

      <!-- Search box (admin mode only) -->
      <div v-if="isAdmin && adminEditMode" class="mt-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search version items"
          class="w-full px-3 py-2 text-sm rounded-lg border transition-colors"
          :class="isSearchActive ? 'bg-gray-800 text-white border-orange-500 placeholder-orange-300/60' : 'bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500'"
        />
      </div>

      <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
        Loading version history...
      </div>

      <div v-else-if="versionsForDisplay.length === 0" class="py-6 text-gray-500 text-sm">
        No versions published yet.
      </div>

      <!-- Version Cards List -->
      <div v-else class="space-y-6 text-sm text-gray-800 dark:text-gray-200">
        <div v-for="ver in versionsForDisplay" :key="ver.id" class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md" :class="[
          isSearchActive ? 'border-2 border-orange-500' : (ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') ? 'border-2 border-dashed border-red-500 dark:border-red-600' : 'border border-gray-200 dark:border-gray-700/80'
        ]">
          <!-- Full-Width Version Panel Card Header -->
          <div class="bg-gray-100 dark:bg-gray-900/50 p-3 md:p-3.5 border-b border-gray-200 dark:border-gray-700/80 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div class="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <span v-if="ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0'" class="font-bold italic text-red-500 dark:text-red-400 text-base md:text-lg">
                  INCOMING CHANGES (clean, group, reassign to other versions)
                </span>
                <template v-else-if="ver.status === 'FUTURE_VERSION'">
                  <span class="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                    {{ ver.title || 'Future Version' }}
                  </span>
                </template>
                <template v-else>
                  <span class="font-mono font-bold text-amber-600 dark:text-amber-400 text-base md:text-lg">
                    v{{ ver.versionNumber }}
                  </span>
                  <span v-if="ver.title" class="font-bold text-gray-900 dark:text-white text-base md:text-lg">
                    {{ ver.title }}
                  </span>
                </template>

                <!-- Create issue markdown button for IN_PROGRESS, FUTURE_VERSION, and INCOMING versions in Admin mode -->
                <div v-if="isAdmin && adminEditMode && (ver.status === 'IN_PROGRESS' || ver.status === 'FUTURE_VERSION' || ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0')" class="inline-flex items-center ml-2">
                  <button
                    @click="copyIssueMarkdown(ver)"
                    title="Copy issue markdown to clipboard"
                    class="px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckIcon v-if="copiedVersionId === ver.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <DocumentTextIcon v-else class="w-3.5 h-3.5" />
                    <span>{{ copiedVersionId === ver.id ? 'Copied to clipboard!' : 'Create issue markdown' }}</span>
                  </button>
                </div>
              </div>
              <div v-if="ver.publishDate && ver.status !== 'FUTURE_VERSION'" class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-mono font-bold shrink-0">
                {{ formatPublishDate(ver.publishDate) }} {{ getRelativeDateStr(ver.publishDate) }}
              </div>
            </div>

            <!-- Description for INCOMING changes section -->
            <p v-if="ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0'" class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic pt-1">
              These are ideas for new features or bug-fixes which come from website users and developers. 
            </p>

            <!-- Right-aligned Version CRUD Actions (Excluding INCOMING) -->
            <div v-if="isAdmin && adminEditMode && ver.status !== 'INCOMING' && ver.status !== 'PROPOSED_ITEMS' && ver.versionNumber !== '0.0.0'" class="text-xs text-gray-500 dark:text-gray-400 shrink-0 font-mono text-right pt-1">
              ( <button @click="openEditVersion(ver)" class="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">edit</button> | <button @click="deleteVersion(ver)" class="text-red-600 dark:text-red-400 hover:text-red-500 font-medium cursor-pointer transition-colors">delete</button> | <button @click="openAddItem(ver.id, 'TOP')" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer transition-colors">add item</button> )
            </div>

            <!-- Move all general items dropdown (for all-general versions in admin mode) -->
            <div v-if="isAdmin && adminEditMode && getGroupedItemsForVersion(ver.versionItems).isAllGeneral && ver.versionItems.length > 0" class="pt-1">
              <select
                @change="moveAllVersionItemsToVersion((ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') ? null : ver.id, ($event.target as HTMLSelectElement).value); ($event.target as HTMLSelectElement).value = ''"
                class="px-1.5 py-0.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded text-[10px] text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer max-w-[270px] truncate"
              >
                <option value="" disabled selected class="font-serif italic text-gray-500 dark:text-gray-400">move all items to version</option>
                <option v-if="ver.id" value="none">Incoming changes</option>
                <option v-for="v in getVersionsForDropdown(ver.id)" :key="v.id" :value="v.id">
                  <template v-if="v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0'">Incoming changes</template>
                  <template v-else-if="v.status === 'FUTURE_VERSION'">{{ v.title || 'Future Version' }}</template>
                  <template v-else>v{{ v.versionNumber }} {{ v.title ? `- ${v.title}` : '' }}</template>
                </option>
              </select>
            </div>
          </div>

          <!-- Version Items Display with Smart Category Grouping -->
          <div class="p-3 md:p-4 space-y-4 bg-white dark:bg-gray-800/40">
            <!-- Case A: ALL items belong to General -> list directly without category group header -->
            <div v-if="getGroupedItemsForVersion(ver.versionItems).isAllGeneral" class="space-y-1.5">
                <ul class="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <li v-for="(item, itemIdx) in ver.versionItems" :key="item.id" class="flex items-start justify-between gap-3 py-0.5">
                    <div class="flex items-start gap-2 flex-1 min-w-0">
                      <span class="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase inline-block" :class="item.type === 'FEATURE' ? 'bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-100 font-normal shadow-sm' : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-[#4ade80] font-normal'">
                        {{ item.type === 'FEATURE' ? 'FEATURE' : 'BUG FIX' }}
                      </span>
                      <span class="flex-1 break-words">{{ formatSentenceCase(item.body) }}</span>
                      
                      <!-- UP / DOWN Rank Controls for Admin -->
                      <div v-if="isAdmin && adminEditMode && ver.versionItems.length > 1" class="flex items-center gap-0.5 shrink-0 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 p-0.5">
                        <button
                          v-if="itemIdx > 0"
                          @click="moveItemRank(item, 'up', ver.versionItems)"
                          title="Move rank UP"
                          class="px-1 py-0.5 text-[10px] font-bold rounded text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer transition-colors"
                        >
                          ▲
                        </button>
                        <button
                          v-if="itemIdx < ver.versionItems.length - 1"
                          @click="moveItemRank(item, 'down', ver.versionItems)"
                          title="Move rank DOWN"
                          class="px-1 py-0.5 text-[10px] font-bold rounded text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer transition-colors"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    <!-- Category, Version & Action buttons for Admin -->
                    <div v-if="isAdmin && adminEditMode" class="flex items-start gap-1.5 shrink-0">
                      <!-- 1. Category dropdown -->
                      <select
                        value=""
                        @change="updateItemCategoryDirectly(item, ($event.target as HTMLSelectElement).value, $event)"
                        class="w-[88px] truncate px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-[11px] text-gray-800 dark:text-gray-300 focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled selected class="font-serif italic text-gray-400 dark:text-gray-500">➔ category</option>
                        <option value="NEW_CATEGORY" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new category</option>
                        <option v-for="cat in sortedCategoriesForDropdown.filter(c => c.id !== item.versionCategoryId)" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                      </select>

                      <!-- 2. Version dropdown -->
                      <select
                        v-if="shouldShowVersionDropdown(item, ver)"
                        value=""
                        @change="updateItemVersionDirectly(item, ($event.target as HTMLSelectElement).value, $event)"
                        class="w-[82px] truncate px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-[11px] text-gray-800 dark:text-gray-300 focus:outline-none cursor-pointer"
                      >
                        <option value="" disabled selected class="font-serif italic text-gray-400 dark:text-gray-500">➔ version</option>
                        <option value="NEW_VERSION" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new version</option>
                        <option v-if="item.versionId" value="none">Incoming changes</option>
                        <option v-for="v in getVersionsForDropdown(item.versionId)" :key="v.id" :value="v.id">
                          <template v-if="v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0'">Incoming changes</template>
                          <template v-else-if="v.status === 'FUTURE_VERSION'">{{ v.title || 'Future Version' }}</template>
                          <template v-else>v{{ v.versionNumber }} {{ v.title ? `- ${v.title}` : '' }}</template>
                        </option>
                      </select>

                      <!-- 3. Action Icons: Edit (gray), Add (green), Delete (dark red) -->
                      <div class="flex items-center gap-1 ml-1 shrink-0">
                        <button
                          @click="openEditItem(item)"
                          title="Edit item"
                          class="p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <PencilIcon class="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          @click="openAddItem(ver.id, item.id, item)"
                          title="Add item"
                          class="p-0.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-[#34d399] hover:text-emerald-900 dark:hover:text-emerald-300 rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <PlusIcon class="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          @click="deleteItem(item)"
                          title="Delete item"
                          class="p-0.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800/60 hover:bg-red-200 dark:hover:bg-red-900/80 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <TrashIcon class="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Case B: Multi-category grouped display -->
              <div v-else class="space-y-4">
                <div v-for="group in getGroupedItemsForVersion(ver.versionItems).groups" :key="group.categoryId" class="space-y-2">
                  <!-- Category Header -->
                  <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700/50 pb-1">
                    <h4 class="text-xs font-bold uppercase tracking-wider" :class="group.categoryTitle.toLowerCase().trim() === 'clean and assign' ? 'italic' : ''" :style="{ color: group.categoryTitle.toLowerCase().trim() === 'clean and assign' ? '#ef4444' : '#d97706' }">
                      {{ group.categoryTitle }}
                    </h4>
                    <span v-if="isAdmin && adminEditMode && group.categoryTitle !== 'Clean and assign' && group.categoryTitle !== 'General'" class="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                      (rank: {{ group.categoryRank }})
                    </span>
                    <button
                      v-if="isAdmin && adminEditMode"
                      @click="openEditCategory(group.categoryId)"
                      title="Edit category"
                      class="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      <PencilSquareIcon class="w-3.5 h-3.5" />
                    </button>

                    <!-- Category Move All to Version dropdown -->
                    <select
                      v-if="isAdmin && adminEditMode"
                      @change="moveCategoryItemsToVersion(group.categoryId, (ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') ? null : ver.id, ($event.target as HTMLSelectElement).value); ($event.target as HTMLSelectElement).value = ''"
                      class="ml-auto px-1.5 py-0.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded text-[10px] text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer max-w-[270px] truncate"
                    >
                      <option value="" disabled selected class="font-serif italic text-gray-500 dark:text-gray-400">move this category and its items to new version</option>
                      <option v-if="ver.id" value="none">Incoming changes</option>
                      <option v-for="v in getVersionsForDropdown(ver.id)" :key="v.id" :value="v.id">
                        <template v-if="v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0'">Incoming changes</template>
                        <template v-else-if="v.status === 'FUTURE_VERSION'">{{ v.title || 'Future Version' }}</template>
                        <template v-else>v{{ v.versionNumber }} {{ v.title ? `- ${v.title}` : '' }}</template>
                      </option>
                    </select>
                  </div>

                  <!-- Category Group Items (Indented) -->
                  <ul class="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 pl-3">
                    <li v-for="(item, itemIdx) in group.items" :key="item.id" class="flex items-start justify-between gap-3 py-0.5">
                      <div class="flex items-start gap-2 flex-1 min-w-0">
                        <span class="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase inline-block" :class="item.type === 'FEATURE' ? 'bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-100 font-normal shadow-sm' : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-[#4ade80] font-normal'">
                          {{ item.type === 'FEATURE' ? 'FEATURE' : 'BUG FIX' }}
                        </span>
                        <span class="flex-1 break-words">{{ formatSentenceCase(item.body) }}</span>
                        
                        <!-- UP / DOWN Rank Controls for Admin -->
                        <div v-if="isAdmin && adminEditMode && group.items.length > 1" class="flex items-center gap-0.5 shrink-0 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 p-0.5">
                          <button
                            v-if="itemIdx > 0"
                            @click="moveItemRank(item, 'up', group.items)"
                            title="Move rank UP"
                            class="px-1 py-0.5 text-[10px] font-bold rounded text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            ▲
                          </button>
                          <button
                            v-if="itemIdx < group.items.length - 1"
                            @click="moveItemRank(item, 'down', group.items)"
                            title="Move rank DOWN"
                            class="px-1 py-0.5 text-[10px] font-bold rounded text-gray-700 dark:text-gray-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer transition-colors"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      <!-- Category, Version & Action buttons for Admin -->
                      <div v-if="isAdmin && adminEditMode" class="flex items-start gap-1.5 shrink-0">
                        <!-- 1. Category dropdown -->
                        <select
                          value=""
                          @change="updateItemCategoryDirectly(item, ($event.target as HTMLSelectElement).value, $event)"
                          class="w-[88px] truncate px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-[11px] text-gray-800 dark:text-gray-300 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled selected class="font-serif italic text-gray-400 dark:text-gray-500">➔ category</option>
                          <option value="NEW_CATEGORY" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new category</option>
                          <option v-for="cat in sortedCategoriesForDropdown.filter(c => c.id !== item.versionCategoryId)" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                        </select>

                        <!-- 2. Version dropdown -->
                        <select
                          v-if="shouldShowVersionDropdown(item, ver)"
                          value=""
                          @change="updateItemVersionDirectly(item, ($event.target as HTMLSelectElement).value, $event)"
                          class="w-[82px] truncate px-1 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-[11px] text-gray-800 dark:text-gray-300 focus:outline-none cursor-pointer"
                        >
                          <option value="" disabled selected class="font-serif italic text-gray-400 dark:text-gray-500">➔ version</option>
                          <option value="NEW_VERSION" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new version</option>
                          <option v-if="item.versionId" value="none">Incoming changes</option>
                          <option v-for="v in getVersionsForDropdown(item.versionId)" :key="v.id" :value="v.id">
                            <template v-if="v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0'">Incoming changes</template>
                            <template v-else-if="v.status === 'FUTURE_VERSION'">{{ v.title || 'Future Version' }}</template>
                            <template v-else>v{{ v.versionNumber }} {{ v.title ? `- ${v.title}` : '' }}</template>
                          </option>
                        </select>

                        <!-- 3. Action Icons: Edit (gray), Add (green), Delete (dark red) -->
                        <div class="flex items-center gap-1 ml-1 shrink-0">
                          <button
                            @click="openEditItem(item)"
                            title="Edit item"
                            class="p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <PencilIcon class="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            @click="openAddItem(ver.id, item.id, item)"
                            title="Add item"
                            class="p-0.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-[#34d399] hover:text-emerald-900 dark:hover:text-emerald-300 rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <PlusIcon class="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            @click="deleteItem(item)"
                            title="Delete item"
                            class="p-0.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800/60 hover:bg-red-200 dark:hover:bg-red-900/80 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded shadow-sm transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <TrashIcon class="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Edit Version Modal -->
    <div v-if="showEditVersionModal && editingVersion" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewVersion ? 'Admin Create: Version' : 'Admin Edit: Version' }}</h3>
        
        <div v-if="versionSaveError" class="p-2.5 bg-red-900/40 border border-red-700/60 rounded text-xs text-red-300 font-mono">
          {{ versionSaveError }}
        </div>

        <form @submit.prevent="saveAdminVersion" class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Number</label>
            <input v-model="editingVersion.versionNumber" @keydown.enter.exact.prevent="saveAdminVersion" type="text" placeholder="0.14.0" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Version Title</label>
            <input v-model="editingVersion.title" @keydown.enter.exact.prevent="saveAdminVersion" type="text" placeholder="Version feature description" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Publish Date (YYYY-MM-DD)</label>
            <input v-model="editingVersion.publishDate" @keydown.enter.exact.prevent="saveAdminVersion" type="date" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono" />
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select v-model="editingVersion.status" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="FUTURE_VERSION">FUTURE_VERSION</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showEditVersionModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold flex items-center gap-1.5">
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Admin Edit Item Modal -->
    <div v-if="showEditItemModal && editingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewItem ? 'Admin Add: Roadmap Item' : 'Admin Edit: Roadmap Item' }}</h3>
        <form @submit.prevent="saveAdminItem" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select v-model="editingItem.type" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option value="BUGFIX">🐛 BUGFIX</option>
                <option value="FEATURE">✨ FEATURE</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select v-model="editingItem.versionCategoryId" @change="handleItemCategoryChange" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option v-for="cat in sortedCategoriesForDropdown" :key="cat.id" :value="cat.id">{{ cat.title }}</option>
                <option value="NEW_CATEGORY">+ Add category...</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Version</label>
              <select v-model="editingItem.versionId" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono">
                <option v-for="v in displayedVersions" :key="v.id" :value="v.id">
                  <template v-if="v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0'">
                    Incoming changes
                  </template>
                  <template v-else-if="v.status === 'FUTURE_VERSION'">
                    {{ v.title || 'Future Version' }}
                  </template>
                  <template v-else>
                    v{{ v.versionNumber }} {{ v.title ? `- ${v.title}` : '' }}
                  </template>
                </option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Rank (0.0 - 5.0)</label>
              <input
                v-model="itemRankStr"
                @input="handleItemRankInput"
                @keydown.enter.exact.prevent="saveAdminItem"
                type="text"
                inputmode="decimal"
                placeholder="2.5"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Description / Body</label>
            <textarea v-model="editingItem.body" @keydown.enter.exact.prevent="saveAdminItem" rows="3" placeholder="Describe the feature or bug fix..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"></textarea>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showEditItemModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold flex items-center gap-1.5">
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category & Abbreviation Management Modal -->
    <div v-if="showCategoryModal && editingCategory" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ isNewCategory ? 'Add Category' : 'Edit Category' }}</h3>

        <div v-if="categorySaveError" class="p-2.5 bg-red-900/40 border border-red-700/60 rounded text-xs text-red-300 font-mono">
          {{ categorySaveError }}
        </div>

        <form @submit.prevent="saveCategory" class="space-y-3 text-xs">
          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Category Name / Title</label>
            <input
              v-model="editingCategory.title"
              @keydown.enter.exact.prevent="saveCategory"
              type="text"
              placeholder="e.g. Flashcard Page"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Category Rank (0.0 - 5.0)</label>
            <input
              v-model="categoryRankStr"
              @input="handleRankInput"
              @keydown.enter.exact.prevent="saveCategory"
              type="text"
              inputmode="decimal"
              placeholder="2.5"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono"
            />
            <p class="text-[11px] text-gray-400 mt-1">
              Categories (except Clean and assign & General) are displayed in descending order of this rank value.
            </p>
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Abbreviations (comma-separated)</label>
            <input
              v-model="editingCategory.abbreviations"
              @keydown.enter.exact.prevent="saveCategory"
              type="text"
              placeholder="e.g. flash, flashard, fl"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono"
            />
            <p class="text-[11px] text-gray-400 mt-1">
              Items starting with any of these prefixes followed by a colon (e.g. <code>flash:</code>) will be smart-assigned to this category.
            </p>
          </div>

          <div class="flex items-center justify-between pt-3">
            <div>
              <!-- Destructive delete action styled per user rules: dark red link -->
              <button
                v-if="!isNewCategory && editingCategory.title !== 'General' && editingCategory.title !== 'Clean and assign'"
                type="button"
                @click="deleteCategory"
                class="text-red-600 dark:text-red-400 hover:text-red-500 text-xs font-medium cursor-pointer underline"
              >
                delete category
              </button>
            </div>
            <div class="flex space-x-2">
              <button type="button" @click="showCategoryModal = false" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
              <button type="submit" class="px-4 py-1.5 text-xs text-white bg-amber-600 hover:bg-amber-700 rounded font-semibold flex items-center gap-1.5">
                <span>Save Category</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


