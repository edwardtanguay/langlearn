<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { BoltIcon, PencilSquareIcon, PencilIcon, PlusIcon, TrashIcon, CheckIcon, DocumentTextIcon, ClipboardDocumentIcon } from '@heroicons/vue/24/outline'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { compareSemVerDesc, compareSemVerAsc } from '~~/shared/utils/semver'

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
  isTested?: boolean
}

interface Version {
  id: string
  versionNumber: string
  title?: string | null
  description?: string | null
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
const isTypeDropdownOpen = ref(false)
const typeDropdownRef = ref<HTMLElement | null>(null)

function toggleTypeDropdown() {
  isTypeDropdownOpen.value = !isTypeDropdownOpen.value
}

function selectItemType(type: 'BUGFIX' | 'FEATURE') {
  editingItem.value.type = type
  isTypeDropdownOpen.value = false
}

function handleClickOutsideTypeDropdown(e: MouseEvent) {
  if (typeDropdownRef.value && !typeDropdownRef.value.contains(e.target as Node)) {
    isTypeDropdownOpen.value = false
  }
}

const editingItem = ref<{ id: string; versionId: string; versionCategoryId: string; afterItemId: string; body: string; type: 'FEATURE' | 'BUGFIX'; rank: number }>({
  id: '', versionId: 'none', versionCategoryId: '', afterItemId: '', body: '', type: 'BUGFIX', rank: 2.5
})
const itemRankStr = ref('2.5')
const isNewItem = ref(false)

const showEditVersionModal = ref(false)
const editingVersion = ref<{ id: string; versionNumber: string; title: string; description: string; status: 'PUBLISHED' | 'IN_PROGRESS' | 'FUTURE_VERSION' | 'INCOMING' | 'PROPOSED_ITEMS'; publishDate: string }>({
  id: '', versionNumber: '', title: '', description: '', status: 'IN_PROGRESS', publishDate: ''
})
const isNewVersion = ref(false)

// Category Edit Modal
const showCategoryModal = ref(false)
const isNewCategory = ref(false)
const editingCategory = ref<{ id: string; title: string; rank: number; abbreviations: string }>({
  id: '', title: '', rank: 2.5, abbreviations: ''
})
const categoryRankStr = ref('2.5')

const focusFirstModalInput = (focusTextarea = false) => {
  nextTick(() => {
    if (typeof document !== 'undefined') {
      if (focusTextarea) {
        const textarea = document.querySelector('.fixed.inset-0 textarea') as HTMLElement | null
        if (textarea) {
          textarea.focus()
          return
        }
      }
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
  return true
}

const nuxtApp = useNuxtApp()
let removeHookListener: (() => void) | null = null

onMounted(() => {
  checkMobileView()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkMobileView)
    if (window.innerWidth >= 768) {
      const saved = localStorage.getItem('adminEditMode')
      if (saved !== null) {
        adminEditMode.value = saved === 'true'
      }
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutsideTypeDropdown)
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

watch(adminEditMode, (newVal) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminEditMode', newVal ? 'true' : 'false')
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobileView)
  }
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutsideTypeDropdown)
  }
  if (removeHookListener) {
    removeHookListener()
  }
})



const showFutureVersions = ref(false)

const futureVersionsCount = computed(() => {
  return versions.value.filter(v => v.status === 'FUTURE_VERSION').length
})

const inProgressVersions = computed(() => {
  return versions.value
    .filter(v => v.status === 'IN_PROGRESS')
    .sort((a, b) => compareSemVerAsc(a.versionNumber, b.versionNumber))
})

function scrollToVersion(verId: string) {
  if (typeof document !== 'undefined') {
    const el = document.getElementById(`version-${verId}`)
    if (el) {
      const navOffset = 90
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
}

function scrollToItem(itemId: string) {
  if (typeof document !== 'undefined') {
    const el = document.getElementById(`version-item-${itemId}`)
    if (el) {
      const navOffset = 110
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
}


const displayedVersions = computed(() => {
  if (!adminEditMode.value) {
    // Admin mode OFF: show ONLY PUBLISHED versions with at least one item, descending by version number
    return versions.value
      .filter(v => v.status === 'PUBLISHED' && v.versionItems.length > 0)
      .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
  }

  // Admin mode ON:
  // 1. FUTURE versions in descending version order (if showFutureVersions is true)
  // 2. INCOMING version (0.0.0)
  // 3. PUBLISHED and IN_PROGRESS versions in descending version order
  const futureVers = showFutureVersions.value
    ? versions.value
        .filter(v => v.status === 'FUTURE_VERSION')
        .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))
    : []

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

// Sorted categories for dropdowns: pure alphabetical order (A-Z)
const sortedCategoriesForDropdown = computed(() => {
  return [...categories.value].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
})

const recentlyEditedItemId = ref<string | null>(null)
const recentlyEditedVersionId = ref<string | null>(null)

function getVersionColorClass(status: string | undefined): string {
  if (!status) return ''
  if (status === 'FUTURE_VERSION') {
    return 'bg-gray-500/15 text-gray-300 font-semibold'
  } else if (status === 'INCOMING' || status === 'PROPOSED_ITEMS' || status === '0.0.0') {
    return 'bg-red-500/15 text-red-500 dark:text-red-400 font-semibold'
  } else if (status === 'IN_PROGRESS') {
    return 'bg-amber-500/15 text-amber-500 dark:text-amber-400 font-semibold'
  }
  return ''
}

interface DropdownVersionOption {
  id: string
  label: string
  status: string
}

// Precomputed base dropdown options
const baseDropdownVersionOptions = computed<DropdownVersionOption[]>(() => {
  const options: DropdownVersionOption[] = []

  // 1. All FUTURE versions
  const futureVers = versions.value
    .filter(v => v.status === 'FUTURE_VERSION')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))

  for (const f of futureVers) {
    options.push({
      id: f.id,
      label: f.title || `Future Version ${f.versionNumber}`,
      status: 'FUTURE_VERSION'
    })
  }

  // 2. Incoming Ideas (ONLY ONCE)
  options.push({
    id: 'none',
    label: 'Incoming Ideas',
    status: 'INCOMING'
  })

  // 3. All IN_PROGRESS versions
  const inProgressVers = versions.value
    .filter(v => v.status === 'IN_PROGRESS')
    .sort((a, b) => compareSemVerDesc(a.versionNumber, b.versionNumber))

  for (const p of inProgressVers) {
    options.push({
      id: p.id,
      label: p.title ? `v${p.versionNumber} - ${p.title}` : `v${p.versionNumber}`,
      status: 'IN_PROGRESS'
    })
  }

  return options
})

// Ordered: move to new version -> FUTURE -> INCOMING (once) -> IN_PROGRESS, excludes PUBLISHED
function getVersionsForDropdownOptions(includeAllOrVersionId: boolean | string | null = true, currentVersionIdParam?: string | null): DropdownVersionOption[] {
  let includeAll = true
  let currentVersionId: string | null | undefined = currentVersionIdParam

  if (typeof includeAllOrVersionId === 'boolean') {
    includeAll = includeAllOrVersionId
  } else {
    currentVersionId = includeAllOrVersionId
  }

  if (includeAll || !currentVersionId) {
    return baseDropdownVersionOptions.value
  }

  const incomingVer = versions.value.find(v => v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0')
  const incomingId = incomingVer?.id || 'none'

  return baseDropdownVersionOptions.value.filter(opt => {
    if (opt.id === currentVersionId) return false
    if ((opt.id === 'none' || opt.id === incomingId) && (currentVersionId === 'none' || currentVersionId === incomingId)) return false
    return true
  })
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

const groupedItemsCache = new WeakMap<VersionItem[], { isAllGeneral: boolean; groups: CategoryGroup[]; allItems: VersionItem[] }>()

function invalidateVersionCache(verOrItems?: Version | VersionItem[] | null) {
  if (!verOrItems) return
  if (Array.isArray(verOrItems)) {
    groupedItemsCache.delete(verOrItems)
  } else if (verOrItems.versionItems) {
    groupedItemsCache.delete(verOrItems.versionItems)
    verOrItems.versionItems = [...verOrItems.versionItems]
  }
}

function getGroupedItemsForVersion(items: VersionItem[]): { isAllGeneral: boolean; groups: CategoryGroup[]; allItems: VersionItem[] } {
  if (!items || items.length === 0) {
    return { isAllGeneral: true, groups: [], allItems: [] }
  }

  const cached = groupedItemsCache.get(items)
  if (cached) return cached

  const generalCat = categories.value.find(c => c.title === 'General')
  const generalId = generalCat?.id

  const isAllGeneral = items.every(item => {
    if (!item.versionCategoryId) return true
    if (generalId && item.versionCategoryId === generalId) return true
    return item.versionCategory?.title === 'General'
  })

  if (isAllGeneral) {
    const res = { isAllGeneral: true, groups: [], allItems: sortItemsByRankAndType(items) }
    groupedItemsCache.set(items, res)
    return res
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

  const res = { isAllGeneral: false, groups: resultGroups, allItems: sortItemsByRankAndType(items) }
  groupedItemsCache.set(items, res)
  return res
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
  let result = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
  if (trimmed.length > 30) {
    const lastChar = result.slice(-1)
    if (lastChar !== '.' && lastChar !== '!' && lastChar !== '?') {
      result += '.'
    }
  }
  return result
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
  if (diffDays === -1) return '(tomorrow)'
  if (diffDays < -1) return `(in ${Math.abs(diffDays)} days)`
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
    description: '',
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
  editingVersion.value = {
    id: ver.id,
    versionNumber: ver.versionNumber,
    title: ver.title || '',
    description: ver.description || '',
    status: ver.status as any,
    publishDate: formattedDate
  }
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

  if (payload.status === 'PUBLISHED' && !isNewVersion.value) {
    const existing = versions.value.find(v => v.id === editingVersion.value.id)
    if (existing && existing.versionItems.some(item => !item.isTested)) {
      versionSaveError.value = 'Cannot publish version until all items are tested.'
      return
    }
  }

  const snapshot = JSON.parse(JSON.stringify(versions.value))

  let tempVersionId: string | null = null

  // Optimistic update & immediate smooth close
  if (!isNewVersion.value) {
    const existing = versions.value.find(v => v.id === editingVersion.value.id)
    if (existing) {
      existing.versionNumber = payload.versionNumber
      existing.title = payload.title
      existing.description = payload.description
      existing.status = payload.status
      existing.publishDate = payload.publishDate
    }
  } else {
    tempVersionId = `temp-${Date.now()}`
    const newVer: Version = {
      id: tempVersionId,
      versionNumber: payload.versionNumber,
      title: payload.title || '',
      description: payload.description || '',
      status: payload.status,
      publishDate: payload.publishDate,
      versionItems: []
    }
    versions.value = [...versions.value, newVer]
  }
  showEditVersionModal.value = false

  if (tempVersionId) {
    recentlyEditedVersionId.value = tempVersionId
    nextTick(() => {
      scrollToVersion(tempVersionId!)
    })
    setTimeout(() => {
      if (recentlyEditedVersionId.value === tempVersionId) {
        recentlyEditedVersionId.value = null
      }
    }, 1000)
  }

  try {
    if (isNewVersion.value) {
      const created = await $fetch<Version>('/api/dev/versions', {
        method: 'POST',
        body: payload
      })
      if (created?.id && tempVersionId) {
        const found = versions.value.find(v => v.id === tempVersionId)
        if (found) {
          found.id = created.id
        }
        if (recentlyEditedVersionId.value === tempVersionId) {
          recentlyEditedVersionId.value = created.id
        }
      }
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
      versionId: versionId || sourceItem.versionId || 'none',
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
  isTypeDropdownOpen.value = false
  showEditItemModal.value = true
  focusFirstModalInput(true)
}

const openEditItem = (item: VersionItem) => {
  isNewItem.value = false
  isTypeDropdownOpen.value = false
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
    openAddCategory(null, true)
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

  let tempItemId: string | null = null

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
          invalidateVersionCache(parentVer)
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
            invalidateVersionCache(targetVer)
          }
        }
      } else if (parentVer) {
        invalidateVersionCache(parentVer)
      }
    }
  } else {
    tempItemId = `temp-${Date.now()}`
    const targetCat = categories.value.find(c => c.id === payload.versionCategoryId) || null
    const newItemObj: VersionItem = {
      id: tempItemId,
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
        invalidateVersionCache(incomingVer)
      }
      unassignedItems.value.unshift(newItemObj)
    } else {
      const targetVer = versions.value.find(v => v.id === payload.versionId)
      if (targetVer) {
        targetVer.versionItems.unshift(newItemObj)
        invalidateVersionCache(targetVer)
      }
    }
  }

  showEditItemModal.value = false
  const targetId = payload.id || tempItemId
  if (targetId) {
    recentlyEditedItemId.value = targetId
    nextTick(() => {
      scrollToItem(targetId)
    })
    setTimeout(() => {
      if (recentlyEditedItemId.value === targetId) {
        recentlyEditedItemId.value = null
      }
    }, 1800)
  }

  try {
    if (isNewItem.value) {
      const created = await $fetch<VersionItem>('/api/dev/version-items', {
        method: 'POST',
        body: payload
      })
      if (created?.id && tempItemId) {
        recentlyEditedItemId.value = created.id
        setTimeout(() => {
          if (recentlyEditedItemId.value === created.id) {
            recentlyEditedItemId.value = null
          }
        }, 1800)
        if (!payload.versionId) {
          const item = unassignedItems.value.find(i => i.id === tempItemId || i.body === payload.body)
          if (item) item.id = created.id
          const incomingVer = versions.value.find(v => v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS' || v.versionNumber === '0.0.0')
          if (incomingVer) {
            const vItem = incomingVer.versionItems.find(i => i.id === tempItemId || i.body === payload.body)
            if (vItem) vItem.id = created.id
            invalidateVersionCache(incomingVer)
          }
        } else {
          const targetVer = versions.value.find(v => v.id === payload.versionId)
          const item = targetVer?.versionItems.find(i => i.id === tempItemId || i.body === payload.body)
          if (item) item.id = created.id
          if (targetVer) invalidateVersionCache(targetVer)
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
            invalidateVersionCache(v)
            break
          }
        }
      }
    }
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    for (const v of versions.value) {
      invalidateVersionCache(v)
    }
    alert(err.data?.statusMessage || 'Failed to save item')
  }
}

const updateItemCategoryDirectly = async (item: VersionItem, categoryId: string, event?: Event) => {
  if (event?.target) {
    (event.target as HTMLSelectElement).value = ''
  }
  if (!categoryId || categoryId === item.versionCategoryId) return
  if (categoryId === 'NEW_CATEGORY') {
    openAddCategory(item, false)
    return
  }
  const oldCatId = item.versionCategoryId
  const oldCatObj = item.versionCategory
  const newCat = categories.value.find(c => c.id === categoryId) || null

  // Optimistic update
  item.versionCategoryId = categoryId || null
  item.versionCategory = newCat

  const parentVer = versions.value.find(v => v.versionItems.some(i => i.id === item.id))
  if (parentVer) {
    invalidateVersionCache(parentVer)
  } else {
    unassignedItems.value = [...unassignedItems.value]
  }

  recentlyEditedItemId.value = item.id
  nextTick(() => {
    scrollToItem(item.id)
  })
  setTimeout(() => {
    if (recentlyEditedItemId.value === item.id) {
      recentlyEditedItemId.value = null
    }
  }, 1800)

  try {
    await $fetch(`/api/dev/version-items/${item.id}`, {
      method: 'PUT',
      body: { versionCategoryId: categoryId || null }
    })
    await loadData(false)
  } catch (err: any) {
    item.versionCategoryId = oldCatId
    item.versionCategory = oldCatObj
    if (parentVer) {
      invalidateVersionCache(parentVer)
    }
    alert(err.data?.statusMessage || 'Failed to update item category')
  }
}

const toggleItemTestedDirectly = async (item: VersionItem) => {
  const oldTested = Boolean(item.isTested)
  const newTested = !oldTested
  item.isTested = newTested

  try {
    await $fetch(`/api/dev/version-items/${item.id}`, {
      method: 'PUT',
      body: { isTested: newTested }
    })
  } catch (err: any) {
    item.isTested = oldTested
    alert(err.data?.statusMessage || 'Failed to update tested status')
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
        invalidateVersionCache(oldVer)
      }
    }
    // Add to new location
    if (targetVerId === null) {
      unassignedItems.value.push(item)
    } else {
      const targetVer = versions.value.find(v => v.id === targetVerId)
      if (targetVer) {
        targetVer.versionItems.push(item)
        invalidateVersionCache(targetVer)
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

const findVersionInState = (versionId: string | null) => {
  if (!versionId || versionId === 'none' || versionId === '' || versionId === '0.0.0') {
    return versions.value.find(v => v.versionNumber === '0.0.0' || v.status === 'INCOMING' || v.status === 'PROPOSED_ITEMS')
  }
  return versions.value.find(v => v.id === versionId)
}

const moveCategoryItemsToVersion = async (categoryId: string, sourceVersionId: string | null, targetVersionId: string) => {
  if (!targetVersionId) return
  const finalTargetVerId = (targetVersionId === 'none' || targetVersionId === '') ? null : targetVersionId
  const finalSourceVerId = (sourceVersionId === 'none' || sourceVersionId === '') ? null : sourceVersionId

  const srcVer = findVersionInState(finalSourceVerId)
  const tgtVer = findVersionInState(finalTargetVerId)

  if (srcVer && tgtVer && srcVer.id === tgtVer.id) return

  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Collect matching items from source version
  let matchingItems: VersionItem[] = []
  if (srcVer) {
    matchingItems = srcVer.versionItems.filter(i => i.versionCategoryId === categoryId)
  } else {
    matchingItems = unassignedItems.value.filter(i => i.versionCategoryId === categoryId)
  }

  if (matchingItems.length === 0) return

  const targetVerIdToAssign = tgtVer?.id || null

  // Optimistically move matching items to target version
  matchingItems.forEach(item => {
    item.versionId = targetVerIdToAssign
  })

  // Remove matching items from source version
  if (srcVer) {
    srcVer.versionItems = srcVer.versionItems.filter(i => i.versionCategoryId !== categoryId)
  }
  unassignedItems.value = unassignedItems.value.filter(i => i.versionCategoryId !== categoryId)

  // Add matching items to target version
  if (tgtVer) {
    tgtVer.versionItems = [...tgtVer.versionItems, ...matchingItems]
  } else {
    unassignedItems.value = [...unassignedItems.value, ...matchingItems]
  }

  try {
    await $fetch('/api/dev/version-items/move-category', {
      method: 'POST',
      body: { versionCategoryId: categoryId, sourceVersionId: srcVer?.id || finalSourceVerId, targetVersionId: tgtVer?.id || finalTargetVerId }
    })
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

  const srcVer = findVersionInState(finalSourceVerId)
  const tgtVer = findVersionInState(finalTargetVerId)

  if (srcVer && tgtVer && srcVer.id === tgtVer.id) return

  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))
  const snapshotUnassigned = JSON.parse(JSON.stringify(unassignedItems.value))

  // Collect all items from source version
  let matchingItems: VersionItem[] = []
  if (srcVer) {
    matchingItems = [...srcVer.versionItems]
  } else {
    matchingItems = [...unassignedItems.value]
  }

  if (matchingItems.length === 0) return

  const targetVerIdToAssign = tgtVer?.id || null

  // Optimistically move all items to target version
  matchingItems.forEach(item => {
    item.versionId = targetVerIdToAssign
  })

  // Clear source version items
  if (srcVer) {
    srcVer.versionItems = []
  }
  unassignedItems.value = []

  // Add items to target version
  if (tgtVer) {
    tgtVer.versionItems = [...tgtVer.versionItems, ...matchingItems]
  } else {
    unassignedItems.value = [...matchingItems]
  }

  try {
    await $fetch('/api/dev/version-items/move-all', {
      method: 'POST',
      body: { sourceVersionId: finalSourceVerId, targetVersionId: finalTargetVerId }
    })
  } catch (err: any) {
    versions.value = snapshotVersions
    unassignedItems.value = snapshotUnassigned
    alert(err.data?.statusMessage || 'Failed to move version items')
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
const itemPendingCategoryMove = ref<VersionItem | null>(null)
const cameFromItemModal = ref<boolean>(false)
const previousItemModalCategoryId = ref<string>('')

const openAddCategory = (item?: VersionItem | null, fromItemModal: boolean = false) => {
  itemPendingCategoryMove.value = item || null
  cameFromItemModal.value = fromItemModal
  if (fromItemModal) {
    previousItemModalCategoryId.value = editingItem.value.versionCategoryId || ''
    showEditItemModal.value = false
  }
  isNewCategory.value = true
  categorySaveError.value = ''
  categoryRankStr.value = '2.5'
  editingCategory.value = { id: '', title: '', rank: 2.5, abbreviations: '' }
  showCategoryModal.value = true
  focusFirstModalInput()
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  if (cameFromItemModal.value) {
    editingItem.value.versionCategoryId = previousItemModalCategoryId.value
    showEditItemModal.value = true
  }
  itemPendingCategoryMove.value = null
  cameFromItemModal.value = false
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

  const snapshotCategories = JSON.parse(JSON.stringify(categories.value))
  const snapshotVersions = JSON.parse(JSON.stringify(versions.value))

  const targetItem = itemPendingCategoryMove.value
  const fromModal = cameFromItemModal.value
  const tempCatId = isNewCategory.value ? `temp-cat-${Date.now()}` : editingCategory.value.id

  const newCatObj: VersionCategory = {
    id: tempCatId,
    title,
    rank: rankVal,
    abbreviations: abbrArray.map(a => ({ id: `temp-abbr-${Math.random()}`, abbreviationText: a, versionCategoryId: tempCatId }))
  }

  // Optimistic update & immediate smooth close
  if (!isNewCategory.value) {
    const existing = categories.value.find(c => c.id === editingCategory.value.id)
    if (existing) {
      existing.title = title
      existing.rank = rankVal
    }
  } else {
    categories.value = [...categories.value, newCatObj]
  }

  recentlyEditedCategoryId.value = tempCatId
  setTimeout(() => {
    if (recentlyEditedCategoryId.value === tempCatId) {
      recentlyEditedCategoryId.value = null
    }
  }, 2000)

  let parentVer: Version | undefined = undefined
  let oldCatId: string | null | undefined = undefined
  let oldCatObj: VersionCategory | null | undefined = undefined

  if (targetItem) {
    oldCatId = targetItem.versionCategoryId
    oldCatObj = targetItem.versionCategory
    targetItem.versionCategoryId = tempCatId
    targetItem.versionCategory = newCatObj

    parentVer = versions.value.find(v => v.versionItems.some(i => i.id === targetItem.id))
    if (parentVer) {
      invalidateVersionCache(parentVer)
    }

    recentlyEditedItemId.value = targetItem.id
    nextTick(() => {
      scrollToItem(targetItem.id)
    })
    setTimeout(() => {
      if (recentlyEditedItemId.value === targetItem.id) {
        recentlyEditedItemId.value = null
      }
    }, 1800)
  }

  if (fromModal) {
    editingItem.value.versionCategoryId = tempCatId
    showEditItemModal.value = true
  }

  showCategoryModal.value = false
  itemPendingCategoryMove.value = null
  cameFromItemModal.value = false

  try {
    if (isNewCategory.value) {
      const created = await $fetch<VersionCategory>('/api/dev/categories', {
        method: 'POST',
        body: { title, rank: rankVal, abbreviations: abbrArray }
      })
      if (created?.id) {
        const catInList = categories.value.find(c => c.id === tempCatId)
        if (catInList) {
          catInList.id = created.id
        }
        if (editingItem.value?.versionCategoryId === tempCatId) {
          editingItem.value.versionCategoryId = created.id
        }
        if (targetItem) {
          targetItem.versionCategoryId = created.id
          await $fetch(`/api/dev/version-items/${targetItem.id}`, {
            method: 'PUT',
            body: { versionCategoryId: created.id }
          })
        }
      }
    } else {
      await $fetch(`/api/dev/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: { title, rank: rankVal, abbreviations: abbrArray }
      })
    }
    await loadData(false)
  } catch (err: any) {
    categories.value = snapshotCategories
    versions.value = snapshotVersions
    if (targetItem) {
      targetItem.versionCategoryId = oldCatId
      targetItem.versionCategory = oldCatObj
    }
    if (parentVer) {
      invalidateVersionCache(parentVer)
    }
    categorySaveError.value = err.data?.statusMessage || err.message || 'Failed to save category'
    alert(err.data?.statusMessage || err.message || 'Failed to save category')
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
  md += `All todos in this issue are expressed in the past tense as if they have already been accomplished. The goal is to implement each bug-fix and feature to the extent that their text is 100% true of the app. You MUST implement each of these, do not skip any of them.\n\n`

  const grouped = getGroupedItemsForVersion(ver.versionItems)
  if (grouped.isAllGeneral) {
    if (grouped.allItems.length > 0) {
      md += `## General\n\n`
      for (const item of grouped.allItems) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        md += `- ${prefix}: ${formatSentenceCase(item.body)}\n\n`
      }
    }
  } else {
    for (const group of grouped.groups) {
      md += `## ${group.categoryTitle}\n\n`
      for (const item of group.items) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        md += `- ${prefix}: ${formatSentenceCase(item.body)}\n\n`
      }
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

const copiedBranchVersionId = ref<string | null>(null)
let copiedBranchTimeout: ReturnType<typeof setTimeout> | null = null

function getBranchName(ver: Version): string {
  const versionSlug = ver.versionNumber.replace(/\./g, '-')
  return `version-${versionSlug}`
}

async function copyBranchName(ver: Version) {
  const branchName = getBranchName(ver)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(branchName)
    }
    copiedBranchVersionId.value = ver.id
    if (copiedBranchTimeout) clearTimeout(copiedBranchTimeout)
    copiedBranchTimeout = setTimeout(() => {
      copiedBranchVersionId.value = null
    }, 2500)
  } catch (err) {
    console.error('Failed to copy branch name to clipboard', err)
  }
}

const copiedPromptVersionId = ref<string | null>(null)
let copiedPromptTimeout: ReturnType<typeof setTimeout> | null = null

function generateVersionPrompt(ver: Version): string {
  let itemsMd = ''
  const grouped = getGroupedItemsForVersion(ver.versionItems)
  if (grouped.isAllGeneral) {
    if (grouped.allItems.length > 0) {
      itemsMd += `## General\n\n`
      for (const item of grouped.allItems) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        itemsMd += `- ${prefix}: ${formatSentenceCase(item.body)}\n\n`
      }
    }
  } else {
    for (const group of grouped.groups) {
      itemsMd += `## ${group.categoryTitle}\n\n`
      for (const item of group.items) {
        const prefix = item.type === 'FEATURE' ? 'FEATURE' : 'BUG-FIX'
        itemsMd += `- ${prefix}: ${formatSentenceCase(item.body)}\n\n`
      }
    }
  }

  return `Summarize the changes in this version into one title (50 characters or less) and a description paragraph (150 words or less): \n\n${itemsMd.trim()}`
}

async function copyVersionPrompt(ver: Version) {
  const promptText = generateVersionPrompt(ver)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(promptText)
    }
    copiedPromptVersionId.value = ver.id
    if (copiedPromptTimeout) clearTimeout(copiedPromptTimeout)
    copiedPromptTimeout = setTimeout(() => {
      copiedPromptVersionId.value = null
    }, 2500)
  } catch (err) {
    console.error('Failed to copy version prompt to clipboard', err)
  }
}

// Non-admin card view mode (description vs items)
const versionViewMode = ref<Record<string, 'description' | 'items'>>({})

function handleVersionCardClick(verId: string, event: MouseEvent) {
  if (adminEditMode.value) return

  // Don't toggle if user was selecting text
  const selection = window.getSelection()?.toString()
  if (selection && selection.trim().length > 0) return

  // Don't toggle if clicking an interactive element
  const target = event.target as HTMLElement
  if (target.closest('a, button, input, textarea, select')) return

  const current = versionViewMode.value[verId] || 'description'
  versionViewMode.value[verId] = current === 'description' ? 'items' : 'description'
}

// Admin mode description editor state & handlers
const adminDescOpenMap = ref<Record<string, boolean>>({})
const adminDescSavedId = ref<string | null>(null)
let adminDescSaveTimeout: ReturnType<typeof setTimeout> | null = null

function toggleAdminDescOpen(verId: string) {
  adminDescOpenMap.value[verId] = !adminDescOpenMap.value[verId]
}

function handleAdminDescInput(ver: Version, val: string) {
  ver.description = val
}

async function saveAdminDesc(ver: Version) {
  const trimmed = ver.description ? ver.description.trim() : null
  ver.description = trimmed
  try {
    await $fetch(`/api/dev/versions/${ver.id}`, {
      method: 'PUT',
      body: { description: trimmed }
    })
    adminDescSavedId.value = ver.id
    if (adminDescSaveTimeout) clearTimeout(adminDescSaveTimeout)
    adminDescSaveTimeout = setTimeout(() => {
      adminDescSavedId.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to save version description', err)
  }
}

// Category Title Editing (Inline & Modal) Attention Grabber
const recentlyEditedCategoryId = ref<string | null>(null)
const inlineEditingCategoryId = ref<string | null>(null)
const inlineCategoryTitle = ref('')

function startInlineCategoryEdit(catId: string, currentTitle: string) {
  inlineEditingCategoryId.value = catId
  inlineCategoryTitle.value = currentTitle
  nextTick(() => {
    const input = document.querySelector(`input[data-cat-edit="${catId}"]`) as HTMLInputElement | null
    if (input) input.focus()
  })
}

async function saveInlineCategoryName(catId: string) {
  if (inlineEditingCategoryId.value !== catId) return
  const newTitle = inlineCategoryTitle.value.trim()
  inlineEditingCategoryId.value = null
  if (!newTitle) return

  const cat = categories.value.find(c => c.id === catId)
  if (!cat || cat.title === newTitle) return

  const oldTitle = cat.title
  cat.title = newTitle

  for (const v of versions.value) {
    invalidateVersionCache(v)
  }

  recentlyEditedCategoryId.value = catId
  setTimeout(() => {
    if (recentlyEditedCategoryId.value === catId) {
      recentlyEditedCategoryId.value = null
    }
  }, 2000)

  try {
    await $fetch(`/api/dev/categories/${catId}`, {
      method: 'PUT',
      body: { title: newTitle }
    })
    await loadData(false)
  } catch (err: any) {
    cat.title = oldTitle
    for (const v of versions.value) {
      invalidateVersionCache(v)
    }
    alert(err.data?.statusMessage || err.message || 'Failed to update category name')
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
          class="w-full px-3 py-2 text-sm rounded-lg border transition-colors outline-none focus:outline-none focus:ring-0"
          :class="isSearchActive ? 'bg-gray-800 text-white border-orange-500 placeholder-orange-300/60' : 'bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500'"
        />
      </div>

      <!-- Toggle link for Future Versions and IN_PROGRESS links in Admin Mode -->
      <div v-if="!isLoading && isAdmin && adminEditMode" class="pt-1 mb-3 flex flex-wrap items-center gap-3">
        <button
          v-if="futureVersionsCount > 0"
          type="button"
          @click="showFutureVersions = !showFutureVersions"
          class="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer select-none"
        >
          <span class="text-amber-500 dark:text-amber-400">{{ showFutureVersions ? '▼' : '▶' }}</span>
          <span>{{ showFutureVersions ? 'Hide future versions' : `Show future versions (${futureVersionsCount})` }}</span>
        </button>

        <div v-if="inProgressVersions.length > 0" class="flex items-center gap-2">
          <span v-if="futureVersionsCount > 0" class="text-xs text-gray-400 dark:text-gray-600">|</span>
          <button
            v-for="ipv in inProgressVersions"
            :key="ipv.id"
            type="button"
            @click="scrollToVersion(ipv.id)"
            class="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 underline cursor-pointer"
            :title="`Scroll to version ${ipv.versionNumber}`"
          >
            v{{ ipv.versionNumber }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-sm text-gray-500 font-mono">
        Loading version history...
      </div>

      <div v-else-if="versionsForDisplay.length === 0" class="py-6 text-gray-500 text-sm">
        No versions published yet.
      </div>

      <!-- Version Cards List -->
      <div v-else class="space-y-6 text-sm text-gray-800 dark:text-gray-200">
        <div v-for="ver in versionsForDisplay" :key="ver.id" :id="`version-${ver.id}`"
          @click="handleVersionCardClick(ver.id, $event)"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md scroll-mt-24 transition-all"
          :class="[
            recentlyEditedVersionId === ver.id
              ? 'border-4 border-dashed border-amber-500 dark:border-amber-600'
              : isSearchActive
                ? 'border-2 border-orange-500'
                : (ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0')
                  ? 'border-2 border-dashed border-red-500 dark:border-red-600'
                  : ver.status === 'IN_PROGRESS'
                    ? 'border-2 border-dashed border-amber-500 dark:border-amber-600'
                    : 'border border-gray-200 dark:border-gray-700/80',
            !adminEditMode ? 'cursor-pointer select-text' : ''
          ]"
        >
          <!-- Full-Width Version Panel Card Header -->
          <div class="bg-gray-100 dark:bg-gray-900/50 p-3 md:p-3.5 border-b border-gray-200 dark:border-gray-700/80 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div class="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <span v-if="ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0'" class="font-bold italic text-red-500 dark:text-red-400 text-base md:text-lg">
                  INCOMING IDEAS (clean, group, reassign to other versions)
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
              </div>

              <!-- Header Status / Date / Mode Pill -->
              <div v-if="isAdmin && adminEditMode && ver.status === 'IN_PROGRESS'" class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-mono font-bold shrink-0 uppercase tracking-wider">
                IN PROGRESS
              </div>
              <div v-else-if="isAdmin && adminEditMode && ver.status === 'FUTURE_VERSION'" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono font-bold shrink-0 uppercase tracking-wider">
                FUTURE VERSION
              </div>
              <div v-else class="flex items-center gap-2 shrink-0">
                <span v-if="!adminEditMode" class="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {{ (versionViewMode[ver.id] || 'description') === 'description' ? 'Description' : 'Items' }}
                </span>
                <span v-if="ver.publishDate" class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-mono font-bold">
                  {{ formatPublishDate(ver.publishDate) }} {{ getRelativeDateStr(ver.publishDate) }}
                </span>
              </div>
            </div>

            <!-- Issue Markdown, Branch name, and Version prompt buttons for IN_PROGRESS versions in Admin mode (Far left under title) -->
            <div v-if="isAdmin && adminEditMode && ver.status === 'IN_PROGRESS'" class="flex items-center flex-wrap gap-2 pt-0.5">
              <button
                @click="copyIssueMarkdown(ver)"
                title="Copy issue markdown to clipboard"
                class="px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm"
              >
                <CheckIcon v-if="copiedVersionId === ver.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <DocumentTextIcon v-else class="w-3.5 h-3.5" />
                <span>{{ copiedVersionId === ver.id ? 'Copied!' : 'Issue Markdown' }}</span>
              </button>

              <button
                @click="copyBranchName(ver)"
                :title="getBranchName(ver)"
                class="px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm"
              >
                <CheckIcon v-if="copiedBranchVersionId === ver.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <ClipboardDocumentIcon v-else class="w-3.5 h-3.5" />
                <span>{{ copiedBranchVersionId === ver.id ? 'Copied!' : 'Branch name' }}</span>
              </button>

              <button
                @click="copyVersionPrompt(ver)"
                title="Copy version summary prompt for AI"
                class="px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60 hover:bg-amber-200 dark:hover:bg-amber-900/80 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5 shadow-sm"
              >
                <CheckIcon v-if="copiedPromptVersionId === ver.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <BoltIcon v-else class="w-3.5 h-3.5" />
                <span>{{ copiedPromptVersionId === ver.id ? 'Copied!' : 'Version prompt' }}</span>
              </button>
            </div>

            <!-- Description for INCOMING changes section -->
            <p v-if="ver.versionNumber === '0.0.0'" class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic pt-1">
              These are raw ideas for new features and bug-fixes which come from website users and developers. They need to be examined, verified, written in the past tense, then assigned a category and a version. 
            </p>

            <!-- Expandable / Collapsible Description Editor in Admin Mode -->
            <div v-if="isAdmin && adminEditMode && ver.versionNumber !== '0.0.0'" class="pt-2 border-t border-gray-200 dark:border-gray-700/60">
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <button
                  type="button"
                  @click="toggleAdminDescOpen(ver.id)"
                  class="inline-flex items-center gap-1.5 font-mono font-medium hover:text-gray-900 dark:hover:text-white cursor-pointer select-none"
                >
                  <span class="text-amber-500">{{ adminDescOpenMap[ver.id] ? '▼' : '▶' }}</span>
                  <span>Description</span>
                  <span v-if="ver.description" class="text-[10px] text-gray-400 truncate max-w-[280px]">"{{ ver.description.slice(0, 40) }}..."</span>
                  <span v-else class="text-[10px] text-amber-600 dark:text-amber-400 italic">(none)</span>
                </button>
                <span v-if="adminDescSavedId === ver.id" class="text-[11px] text-emerald-500 font-medium">Saved!</span>
              </div>
              <div v-if="adminDescOpenMap[ver.id]" class="mt-2 space-y-2">
                <textarea
                  :value="ver.description || ''"
                  @input="handleAdminDescInput(ver, ($event.target as HTMLTextAreaElement).value)"
                  @blur="saveAdminDesc(ver)"
                  placeholder="Enter a description paragraph for this version..."
                  rows="3"
                  class="w-full p-2.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:outline-none leading-relaxed"
                ></textarea>
              </div>
            </div>

            <!-- Right-aligned Version CRUD Actions (Excluding INCOMING) -->
            <div v-if="isAdmin && adminEditMode && ver.versionNumber !== '0.0.0'" class="flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400 shrink-0 font-mono pt-1">
              <span>( <button @click="openEditVersion(ver)" class="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">edit</button> | <button @click="deleteVersion(ver)" class="text-red-600 dark:text-red-400 hover:text-red-500 font-medium cursor-pointer transition-colors">delete</button> | <button @click="openAddItem(ver.id, 'TOP')" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer transition-colors">add item</button> )</span>

              <!-- Move all general items dropdown inline -->
              <select
                v-if="getGroupedItemsForVersion(ver.versionItems).isAllGeneral && ver.versionItems.length > 0"
                @change="moveAllVersionItemsToVersion(ver.id, ($event.target as HTMLSelectElement).value); ($event.target as HTMLSelectElement).value = ''"
                class="px-1.5 py-0.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded text-[10px] text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                <option value="" disabled selected class="font-serif italic text-gray-500 dark:text-gray-400">➔ move all items to version</option>
                <option value="NEW_VERSION" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new version</option>
                <option
                  v-for="opt in getVersionsForDropdownOptions(ver.id)"
                  :key="opt.id"
                  :value="opt.id"
                  :class="getVersionColorClass(opt.status)"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Card Content Body with Rightward Pull-Reveal Transition -->
          <div class="relative overflow-hidden">
            <Transition name="pull-reveal" mode="out-in">
              <!-- Non-Admin Default View: Description -->
              <div
                v-if="!adminEditMode && (versionViewMode[ver.id] || 'description') === 'description'"
                key="desc"
                class="p-5 md:p-7 space-y-4 bg-white dark:bg-gray-800/40 select-text"
              >
                <div v-if="ver.description" class="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {{ ver.description }}
                </div>
                <div v-else class="text-sm text-gray-400 dark:text-gray-500 italic py-2">
                  No description provided for this version. Click anywhere on this panel to view the category item list.
                </div>
                <div class="pt-3 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-medium border-t border-gray-100 dark:border-gray-700/40">
                  <span class="text-gray-500 dark:text-gray-400">{{ ver.versionItems.length }} {{ ver.versionItems.length === 1 ? 'item' : 'items' }} in this version</span>
                  <span class="inline-flex items-center gap-1 font-mono">
                    Click panel to view items list &rarr;
                  </span>
                </div>
              </div>

              <!-- Items View (Non-admin toggled, or Admin mode) -->
              <div
                v-else
                key="items"
                class="p-3 md:p-4 space-y-4 bg-white dark:bg-gray-800/40"
              >
                <div v-if="(ver.status === 'INCOMING' || ver.status === 'PROPOSED_ITEMS' || ver.versionNumber === '0.0.0') && ver.versionItems.length === 0" class="text-sm font-medium text-gray-500 dark:text-gray-400 italic py-4 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              All current ideas have been processed. Waiting for new ideas.
            </div>
            <!-- Case A: ALL items belong to General -> list directly without category group header -->
            <div v-else-if="getGroupedItemsForVersion(ver.versionItems).isAllGeneral" class="space-y-1.5">
                <ul class="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <li v-for="(item, itemIdx) in ver.versionItems" :key="item.id" :id="`version-item-${item.id}`" class="flex items-start justify-between gap-3 py-0.5 px-1.5 border-l-4 border-transparent rounded transition-all duration-500" :class="{ '!border-amber-500 bg-amber-100/70 dark:bg-amber-950/40': recentlyEditedItemId === item.id }">
                    <div class="flex items-start gap-2 flex-1 min-w-0">
                      <span class="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase inline-block leading-tight mt-0.5" :class="item.type === 'FEATURE' ? 'bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-100 font-normal shadow-sm' : 'bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-700/60 text-orange-800 dark:text-orange-300 font-normal'">
                        {{ item.type === 'FEATURE' ? 'FEATURE' : 'BUG FIX' }}
                      </span>
                      <!-- Tested checkbox for IN_PROGRESS versions in Admin mode -->
                      <label v-if="isAdmin && adminEditMode && ver.status === 'IN_PROGRESS'" class="shrink-0 flex items-center gap-1 text-[11px] font-medium cursor-pointer select-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-0.5">
                        <input
                          type="checkbox"
                          :checked="Boolean(item.isTested)"
                          @change="toggleItemTestedDirectly(item)"
                          class="rounded border-gray-300 dark:border-gray-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <span>Tested</span>
                      </label>
                      <span class="flex-1 break-words leading-tight mt-0.5">{{ formatSentenceCase(item.body) }}</span>
                      
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
                        <option
                          v-for="opt in getVersionsForDropdownOptions(item.versionId)"
                          :key="opt.id"
                          :value="opt.id"
                          :class="getVersionColorClass(opt.status)"
                        >
                          {{ opt.label }}
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
                    <template v-if="inlineEditingCategoryId === group.categoryId">
                      <input
                        v-model="inlineCategoryTitle"
                        :data-cat-edit="group.categoryId"
                        @blur="saveInlineCategoryName(group.categoryId)"
                        @keydown.enter.prevent="saveInlineCategoryName(group.categoryId)"
                        @keydown.esc.prevent="inlineEditingCategoryId = null"
                        type="text"
                        class="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white dark:bg-gray-800 border-2 border-amber-500 rounded text-amber-700 dark:text-amber-300 outline-none"
                        autofocus
                      />
                    </template>
                    <template v-else>
                      <h4
                        class="text-xs font-bold uppercase tracking-wider transition-all duration-500"
                        :class="[
                          group.categoryTitle.toLowerCase().trim() === 'clean and assign' ? 'italic' : '',
                          recentlyEditedCategoryId === group.categoryId ? 'bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-500 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400 scale-105 shadow-sm' : ''
                        ]"
                        :style="{ color: recentlyEditedCategoryId === group.categoryId ? undefined : (group.categoryTitle.toLowerCase().trim() === 'clean and assign' ? '#ef4444' : '#d97706') }"
                        @dblclick="isAdmin && adminEditMode && group.categoryTitle !== 'Clean and assign' && group.categoryTitle !== 'General' && startInlineCategoryEdit(group.categoryId, group.categoryTitle)"
                        :title="isAdmin && adminEditMode && group.categoryTitle !== 'Clean and assign' && group.categoryTitle !== 'General' ? 'Double click to edit category name inline' : undefined"
                      >
                        {{ group.categoryTitle }}
                      </h4>
                    </template>
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

                    <select
                      v-if="isAdmin && adminEditMode"
                      @change="moveCategoryItemsToVersion(group.categoryId, ver.id, ($event.target as HTMLSelectElement).value); ($event.target as HTMLSelectElement).value = ''"
                      class="ml-auto px-1.5 py-0.5 bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded text-[10px] text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer max-w-[270px] truncate"
                    >
                      <option value="" disabled selected class="font-serif italic text-gray-500 dark:text-gray-400">move this category and its items to new version</option>
                      <option value="NEW_VERSION" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new version</option>
                      <option
                        v-for="opt in getVersionsForDropdownOptions(ver.id)"
                        :key="opt.id"
                        :value="opt.id"
                        :class="getVersionColorClass(opt.status)"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Category Group Items (Indented) -->
                  <ul class="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 pl-3">
                    <li v-for="(item, itemIdx) in group.items" :key="item.id" :id="`version-item-${item.id}`" class="flex items-start justify-between gap-3 py-0.5 px-1.5 border-l-4 border-transparent rounded transition-all duration-500" :class="{ '!border-amber-500 bg-amber-100/70 dark:bg-amber-950/40': recentlyEditedItemId === item.id }">
                      <div class="flex items-start gap-2 flex-1 min-w-0">
                        <span class="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase inline-block leading-tight mt-0.5" :class="item.type === 'FEATURE' ? 'bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-100 font-normal shadow-sm' : 'bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-700/60 text-orange-800 dark:text-orange-300 font-normal'">
                          {{ item.type === 'FEATURE' ? 'FEATURE' : 'BUG FIX' }}
                        </span>
                        <!-- Tested checkbox for IN_PROGRESS versions in Admin mode -->
                        <label v-if="isAdmin && adminEditMode && ver.status === 'IN_PROGRESS'" class="shrink-0 flex items-center gap-1 text-[11px] font-medium cursor-pointer select-none text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-0.5">
                          <input
                            type="checkbox"
                            :checked="Boolean(item.isTested)"
                            @change="toggleItemTestedDirectly(item)"
                            class="rounded border-gray-300 dark:border-gray-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <span>Tested</span>
                        </label>
                        <span class="flex-1 break-words leading-tight mt-0.5">{{ formatSentenceCase(item.body) }}</span>
                        
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
                          <option
                            v-for="opt in getVersionsForDropdownOptions(item.versionId)"
                            :key="opt.id"
                            :value="opt.id"
                            :class="getVersionColorClass(opt.status)"
                          >
                            {{ opt.label }}
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

              <!-- Hint to toggle back to description in non-admin mode -->
              <div v-if="!adminEditMode" class="pt-3 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-medium border-t border-gray-100 dark:border-gray-700/40">
                <span class="text-gray-400 dark:text-gray-500 font-normal">Select text to copy</span>
                <span class="inline-flex items-center gap-1 font-mono">
                  &larr; Click panel to view description
                </span>
              </div>
            </div>
          </Transition>
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
            <label class="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea v-model="editingVersion.description" rows="3" placeholder="Paragraph summarizing this version..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white font-mono leading-relaxed text-xs"></textarea>
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
            <div class="relative" ref="typeDropdownRef">
              <label class="block text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <button
                type="button"
                @click="toggleTypeDropdown"
                class="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono font-semibold text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 cursor-pointer"
                :class="editingItem.type === 'BUGFIX' ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'"
              >
                <span>{{ editingItem.type }}</span>
                <svg
                  class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-150 shrink-0 ml-1"
                  :class="{ 'rotate-180': isTypeDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Custom Dropdown Menu -->
              <div
                v-if="isTypeDropdownOpen"
                class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 py-1 font-mono text-xs overflow-hidden"
              >
                <button
                  type="button"
                  @click="selectItemType('BUGFIX')"
                  class="w-full px-3 py-2 text-left font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center justify-between transition-colors cursor-pointer"
                  :class="{ 'bg-orange-50 dark:bg-orange-950/30': editingItem.type === 'BUGFIX' }"
                >
                  <span>BUGFIX</span>
                  <span v-if="editingItem.type === 'BUGFIX'" class="text-orange-600 dark:text-orange-400 text-xs">✓</span>
                </button>
                <button
                  type="button"
                  @click="selectItemType('FEATURE')"
                  class="w-full px-3 py-2 text-left font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between transition-colors cursor-pointer"
                  :class="{ 'bg-emerald-50 dark:bg-emerald-950/30': editingItem.type === 'FEATURE' }"
                >
                  <span>FEATURE</span>
                  <span v-if="editingItem.type === 'FEATURE'" class="text-emerald-600 dark:text-emerald-400 text-xs">✓</span>
                </button>
              </div>
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
                <option value="NEW_VERSION" class="font-serif italic text-gray-500 dark:text-gray-400">➔ move to new version</option>
                <option
                  v-for="opt in getVersionsForDropdownOptions(editingItem.versionId)"
                  :key="opt.id"
                  :value="opt.id"
                  :class="getVersionColorClass(opt.status)"
                >
                  {{ opt.label }}
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
            <textarea v-model="editingItem.body" @keydown.ctrl.enter.prevent="saveAdminItem" rows="3" placeholder="Describe the feature or bug fix..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white"></textarea>
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
    <div v-if="showCategoryModal && editingCategory" @click.self="closeCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
              <button type="button" @click="closeCategoryModal" class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Cancel</button>
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

<style scoped>
@keyframes subtleBounce {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
.animate-subtle-bounce {
  animation: subtleBounce 0.6s ease-in-out;
}

/* Pull-reveal animation: always pulling out to the right */
.pull-reveal-enter-active,
.pull-reveal-leave-active {
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease;
}

.pull-reveal-enter-from {
  opacity: 0;
  transform: translateX(-35px);
}

.pull-reveal-leave-to {
  opacity: 0;
  transform: translateX(65px);
}
</style>


