<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseMetadata } from '~~/server/utils/metadata-parser'
import { calculateOptimalRank } from '~~/server/utils/rank-config'

useHead({
  title: 'LangLearn - Import Flashcards',
  meta: [
    { name: 'description', content: 'Import your flashcards from a CSV file.' }
  ]
})

const config = useRuntimeConfig()
const isBypass = config.public.bypassAuth
const auth = !isBypass ? useAuth() : null
const loggedIn = computed(() => isBypass ? true : (auth?.loggedIn ?? false))

interface ParsedRow {
  lang1: string;
  lang2: string;
  text1: string;
  text2: string;
  rank: number;
  pronunciation: string;
  memoryHook: string;
}

interface SkippedCard {
  front: string;
  back: string;
}

const fileInput = ref<HTMLInputElement | null>(null)
const parsedData = ref<ParsedRow[]>([])
const isImporting = ref(false)
const importSummary = ref<{ importedCount: number; skippedCount: number; skippedCards: SkippedCard[] } | null>(null)
const importError = ref<string | null>(null)

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '').trim());
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  importSummary.value = null;
  importError.value = null;
  parsedData.value = [];

  const file = target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target?.result as string;
    if (!text) return;

    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    const rows: ParsedRow[] = [];

    for (const line of lines) {
      const row = parseCSVLine(line);
      if (row.length >= 4) {
        const rawText1 = row[2] ?? '';
        const rawText2 = row[3] ?? '';

        const meta1 = parseMetadata(rawText1);
        const meta2 = parseMetadata(rawText2);

        let frontClean = '';
        if ((row[0] ?? '').toLowerCase() === 'english') {
          frontClean = meta1.cleanText;
        } else if ((row[1] ?? '').toLowerCase() === 'english') {
          frontClean = meta2.cleanText;
        } else {
          frontClean = meta1.cleanText;
        }

        const rank = meta1.rank ?? meta2.rank ?? calculateOptimalRank(frontClean);
        const pronunciation = meta1.pronunciation || meta2.pronunciation || '';
        const memoryHook = meta1.memoryHook || meta2.memoryHook || '';

        rows.push({
          lang1: row[0] ?? '',
          lang2: row[1] ?? '',
          text1: rawText1,
          text2: rawText2,
          rank,
          pronunciation,
          memoryHook
        });
      }
    }
    parsedData.value = rows;
  };

  reader.readAsText(file);
}

async function handleImport() {
  if (parsedData.value.length === 0) return;
  
  isImporting.value = true;
  importSummary.value = null;
  importError.value = null;

  try {
    const response = await $fetch('/api/import', {
      method: 'POST',
      body: { rows: parsedData.value }
    });
    
    importSummary.value = response as { importedCount: number; skippedCount: number; skippedCards: SkippedCard[] };
    parsedData.value = []; // Clear table after successful import
    if (fileInput.value) {
      fileInput.value.value = ''; // Reset file input
    }
  } catch (err: any) {
    console.error('Import error:', err);
    importError.value = err.data?.statusMessage || 'An error occurred during import.';
  } finally {
    isImporting.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-0 pb-8 space-y-12 transition-all duration-300">
    <ClientOnly>
      <div v-if="loggedIn" class="mt-8 flex flex-col items-center w-full min-h-[340px] justify-start pt-2">
        <!-- Mobile View Notice -->
        <div class="block md:hidden w-full text-center p-6 bg-gray-50/10 dark:bg-gray-950/5 rounded-3xl border border-gray-200/50 dark:border-gray-850/40">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Desktop Only Feature</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Import is only available in desktop mode.</p>
        </div>

        <!-- Desktop View Import Container -->
        <div class="hidden md:block w-full max-w-4xl space-y-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Import Flashcards from Google Translate</h1>
          <ul class="list-disc list-inside space-y-1.5 text-gray-600 dark:text-gray-400">
            <li>Go to <a href="https://translate.google.com" target="_blank" rel="noopener noreferrer" class="underline text-gray-900 dark:text-white hover:opacity-80">Google Translate</a></li>
            <li>click on the "Saved" star icon</li>
            <li>click the Google Sheets icon</li>
            <li>click "Import the data"</li>
            <li>click File, Download, Comma-separated values (.csv)</li>
            <li>click below on "Import CSV file"</li>
            <li>find and double-click on the file you just imported</li>
          </ul>

          <!-- File Upload -->
          <div class="flex items-center gap-4">
            <input 
              type="file" 
              accept=".csv" 
              ref="fileInput"
              @change="handleFileChange"
              class="hidden"
            >
            <button 
              type="button"
              @click="fileInput?.click()"
              class="px-5 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800 focus:outline-none cursor-pointer"
            >
              Import CSV file
            </button>
          </div>

          <!-- Summary Message -->
          <div v-if="importSummary" class="p-4 mb-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 space-y-2" role="alert">
            <p class="font-medium text-base text-gray-900 dark:text-white">
              {{ importSummary.importedCount }} {{ importSummary.importedCount === 1 ? 'card' : 'cards' }} imported
            </p>
            <div v-if="importSummary.skippedCount > 0" class="space-y-1">
              <p class="text-red-700 dark:text-red-400">
                {{ importSummary.skippedCount }} {{ importSummary.skippedCount === 1 ? 'card was' : 'cards were' }} not imported because they already exist in the database:
              </p>
              <ul class="list-disc list-inside pl-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li v-for="(card, i) in importSummary.skippedCards" :key="i">
                  {{ card.front }} / {{ card.back }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="importError" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span class="font-medium">Error!</span> {{ importError }}
          </div>

          <!-- Data Preview Table -->
          <div v-if="parsedData.length > 0" class="mt-8 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">There are {{ parsedData.length }} {{ parsedData.length === 1 ? 'row' : 'rows' }} to import as flashcards:</h2>
              <button 
                @click="handleImport"
                :disabled="isImporting"
                class="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isImporting ? 'Importing...' : 'Import to Database' }}
              </button>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg max-h-96">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0 shadow-sm z-10">
                  <tr>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Language&nbsp;1</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Text&nbsp;1</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Language&nbsp;2</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Text&nbsp;2</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Rank</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Pronunciation</th>
                    <th scope="col" class="px-6 py-3 whitespace-nowrap">Memory&nbsp;Hook</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in parsedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {{ row.lang1 }}
                    </td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {{ row.text1 }}
                    </td>
                    <td class="px-6 py-4">{{ row.lang2 }}</td>
                    <td class="px-6 py-4">{{ row.text2 }}</td>
                    <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ row.rank }}</td>
                    <td class="px-6 py-4">{{ row.pronunciation }}</td>
                    <td class="px-6 py-4">{{ row.memoryHook }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Clear Google Translate Phrases Section -->
          <div v-if="importSummary" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">You should now clear your Google Translate phrases:</h2>
            <ul class="list-disc list-inside space-y-1.5 text-gray-600 dark:text-gray-400">
              <li>go back to <a href="https://translate.google.com" target="_blank" rel="noopener noreferrer" class="underline text-gray-900 dark:text-white hover:opacity-80">Google Translate</a></li>
              <li>click on the "Saved" star icon</li>
              <li>click on the three-vertical-dot icon</li>
              <li>click on "Clear all saved"</li>
              <li>click on "Delete"</li>
              <li class="italic">start collecting phrases again!</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="mt-8 flex flex-col items-center justify-center text-center p-6 bg-gray-50/10 dark:bg-gray-950/5 rounded-3xl border border-gray-200/50 dark:border-gray-850/40">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2">You must be logged in to import flashcards.</p>
      </div>
    </ClientOnly>
  </div>
</template>
