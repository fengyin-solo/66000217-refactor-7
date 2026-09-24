<template>
  <svg :width="size" :height="size * 1.5" :viewBox="`0 0 ${size} ${size * 1.5}`">
    <circle v-for="d in DOTS" :key="d"
      :cx="DOT_POSITIONS[d][0] * size * 0.45 + size * 0.2"
      :cy="DOT_POSITIONS[d][1] * size * 0.45 + size * 0.15"
      :r="size * 0.12"
      :fill="dots.includes(d) ? '#a855f7' : '#374151'" />
  </svg>
</template>

<script setup lang="ts">
import { DOTS, DOT_POSITIONS } from '../utils/braille'

defineProps<{ dots: number[]; size: number }>()
</script>
