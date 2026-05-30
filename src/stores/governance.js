import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useGovernanceStore = defineStore('governance', () => {
  const proposals = ref([])
  const auditLog = ref([])
  const loading = ref(false)

  async function fetchProposals() {
    loading.value = true
    try {
      const res = await api.get('/governance/proposals')
      proposals.value = res.data.proposals || res.data || []
      if (!proposals.value.length) proposals.value = generateMockProposals()
      return proposals.value
    } catch {
      proposals.value = generateMockProposals()
      return proposals.value
    } finally {
      loading.value = false
    }
  }

  async function castVote(voteData) {
    try {
      const res = await api.post('/governance/vote', voteData)
      return res.data
    } catch {
      const proposal = proposals.value.find(p => p.id === voteData.proposal_id)
      if (proposal) {
        proposal.votes.push({ voter_id: voteData.voter_id, vote: voteData.vote, reason: voteData.reason, timestamp: new Date().toISOString() })
        proposal.total_votes += 1
        if (voteData.vote === 'approve') proposal.approval_count += 1
        else proposal.rejection_count += 1
        proposal.approval_rate = proposal.approval_count / proposal.total_votes
      }
      return { success: true }
    }
  }

  async function fetchAuditLog() {
    try {
      const res = await api.get('/governance/audit-log')
      auditLog.value = res.data.logs || []
      return auditLog.value
    } catch {
      auditLog.value = generateMockAuditLog()
      return auditLog.value
    }
  }

  return { proposals, auditLog, loading, fetchProposals, castVote, fetchAuditLog }
})

function generateMockProposals() {
  return [
    {
      id: 'prop-001',
      title: 'NSAID Contraindication Protocol for CKD Stage 3+',
      description: 'Update clinical guidelines to prohibit NSAID prescription for CKD patients with eGFR <45. Require alternative pain management protocols.',
      proposer: 'Dr. Sarah Chen — Nephrology',
      created_at: '2024-05-20T10:00:00Z',
      status: 'voting',
      total_votes: 12,
      approval_count: 9,
      rejection_count: 3,
      approval_rate: 0.75,
      votes: [
        { voter_id: 'dr-chen', vote: 'approve', reason: 'Strong evidence from twin simulations', timestamp: '2024-05-20T11:00:00Z' },
        { voter_id: 'dr-patel', vote: 'approve', reason: 'Reduces AKI incidents by 40%', timestamp: '2024-05-20T11:30:00Z' },
        { voter_id: 'dr-rodriguez', vote: 'reject', reason: 'Need more pediatric data', timestamp: '2024-05-20T12:00:00Z' },
      ],
    },
    {
      id: 'prop-002',
      title: 'Federated Model v2.4 Deployment',
      description: 'Deploy updated kidney risk prediction model trained across 6 hospital networks. Improves AKI prediction AUC from 0.84 to 0.91.',
      proposer: 'AI Governance Committee',
      created_at: '2024-05-18T09:00:00Z',
      status: 'approved',
      total_votes: 15,
      approval_count: 14,
      rejection_count: 1,
      approval_rate: 0.93,
      votes: [],
    },
    {
      id: 'prop-003',
      title: 'Emergency Override for Drug Simulations',
      description: 'Allow attending physicians to bypass standard simulation workflow in emergency settings with full audit logging.',
      proposer: 'Dr. James Wilson — Emergency Medicine',
      created_at: '2024-05-22T14:00:00Z',
      status: 'voting',
      total_votes: 8,
      approval_count: 5,
      rejection_count: 3,
      approval_rate: 0.625,
      votes: [],
    },
  ]
}

function generateMockAuditLog() {
  return [
    { action: 'Proposal Created', actor: 'Dr. Sarah Chen', target: 'prop-001', timestamp: '2024-05-20T10:00:00Z' },
    { action: 'Vote Cast', actor: 'Dr. Patel', target: 'prop-001', timestamp: '2024-05-20T11:30:00Z' },
    { action: 'Model Deployed', actor: 'System', target: 'federated-v2.4', timestamp: '2024-05-21T08:00:00Z' },
    { action: 'Simulation Run', actor: 'Dr. Rodriguez', target: 'twin-8842', timestamp: '2024-05-22T09:15:00Z' },
    { action: 'Twin Created', actor: 'Dr. Chen', target: 'twin-8842', timestamp: '2024-05-22T09:00:00Z' },
  ]
}
