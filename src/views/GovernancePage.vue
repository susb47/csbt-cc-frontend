<template>
  <div class="min-h-screen bg-dark-950">
    <AppNavbar />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-8 ml-64">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Clinical Governance</h1>
            <p class="text-dark-400">Decentralized protocol voting and audit trails</p>
          </div>
          <div class="space-y-6 mb-8">
            <div v-for="proposal in govStore.proposals" :key="proposal.id" class="glass-panel p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-bold">{{ proposal.title }}</h3>
                    <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="proposalStatusClass(proposal.status)">{{ proposal.status }}</span>
                  </div>
                  <p class="text-dark-400 text-sm mb-2">{{ proposal.description }}</p>
                  <div class="flex items-center gap-4 text-xs text-dark-500">
                    <span>Proposed by {{ proposal.proposer }}</span>
                    <span>{{ formatDate(proposal.created_at) }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-6 mb-4">
                <div class="flex-1">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-dark-500">Approval Rate</span>
                    <span class="font-mono">{{ ((proposal.approval_rate || 0) * 100).toFixed(0) }}%</span>
                  </div>
                  <div class="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div class="h-full bg-success-500 rounded-full" :style="{ width: `${(proposal.approval_rate || 0) * 100}%` }"></div>
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-success-400">{{ proposal.approval_count }}</div>
                  <div class="text-xs text-dark-500">Approve</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-danger-400">{{ proposal.rejection_count }}</div>
                  <div class="text-xs text-dark-500">Reject</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-medical-400">{{ proposal.total_votes }}</div>
                  <div class="text-xs text-dark-500">Total</div>
                </div>
              </div>
              <div v-if="proposal.status === 'voting'" class="flex items-center gap-3">
                <button @click="vote(proposal.id, 'approve')" class="btn-primary text-sm flex items-center gap-2" :disabled="votingId === proposal.id">
                  <CheckIcon class="w-4 h-4" />
                  Approve
                </button>
                <button @click="vote(proposal.id, 'reject')" class="btn-danger text-sm flex items-center gap-2" :disabled="votingId === proposal.id">
                  <XIcon class="w-4 h-4" />
                  Reject
                </button>
              </div>
              <div v-if="proposal.votes?.length" class="mt-4 pt-4 border-t border-dark-700/50">
                <div class="text-xs text-dark-500 font-medium mb-2">Recent Votes</div>
                <div class="space-y-2">
                  <div v-for="(vote, i) in proposal.votes.slice(0, 3)" :key="i" class="flex items-center gap-3 text-sm">
                    <span class="font-mono text-xs text-dark-500">{{ vote.voter_id }}</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium" :class="vote.vote === 'approve' ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'">{{ vote.vote }}</span>
                    <span class="text-dark-500 text-xs">{{ vote.reason }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="glass-panel p-6">
            <h3 class="font-bold mb-4 flex items-center gap-2">
              <ScrollTextIcon class="w-5 h-5 text-medical-400" />
              Audit Log
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-dark-500 border-b border-dark-700">
                    <th class="pb-3 font-medium">Action</th>
                    <th class="pb-3 font-medium">Actor</th>
                    <th class="pb-3 font-medium">Target</th>
                    <th class="pb-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(log, i) in govStore.auditLog" :key="i" class="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td class="py-3">{{ log.action }}</td>
                    <td class="py-3 font-mono text-dark-400">{{ log.actor }}</td>
                    <td class="py-3 font-mono text-dark-400">{{ log.target }}</td>
                    <td class="py-3 text-dark-500">{{ formatDate(log.timestamp) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useGovernanceStore } from '@/stores/governance'
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { CheckIcon, XIcon, ScrollTextIcon } from 'lucide-vue-next'

const govStore = useGovernanceStore()
const authStore = useAuthStore()
const votingId = ref('')

onMounted(() => {
  govStore.fetchProposals()
  govStore.fetchAuditLog()
})

async function vote(proposalId, voteType) {
  votingId.value = proposalId
  await govStore.castVote({
    proposal_id: proposalId,
    voter_id: authStore.user?.username || 'anonymous',
    vote: voteType,
    reason: voteType === 'approve' ? 'Evidence supports this protocol' : 'Needs more data',
  })
  votingId.value = ''
}

function proposalStatusClass(status) {
  const map = { voting: 'bg-medical-500/10 text-medical-400', approved: 'bg-success-500/10 text-success-400', rejected: 'bg-danger-500/10 text-danger-400' }
  return map[status] || map.voting
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
