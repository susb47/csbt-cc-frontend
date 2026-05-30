<template>
  <div class="min-h-screen bg-dark-950 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-medical-600/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-medical-400/5 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s"></div>
    </div>
    <nav class="relative z-10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-medical-400 to-medical-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-500/20">
          <DnaIcon class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-gradient">CausalBioTwin</span>
      </div>
      <router-link to="/login" class="btn-primary">Enter Platform</router-link>
    </nav>
    <main class="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
      <div class="text-center max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-medical-500/10 border border-medical-500/20 rounded-full text-medical-300 text-sm font-medium mb-8">
          <SparklesIcon class="w-4 h-4" />
          AI-Powered Healthcare Digital Twin Platform
        </div>
        <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Simulate. Predict.
          <span class="text-gradient block">Save Lives.</span>
        </h1>
        <p class="text-xl text-dark-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Build digital biological twins, simulate drug treatments with explainable AI,
          and coordinate decentralized medical intelligence across hospital networks.
        </p>
        <div class="flex items-center justify-center gap-4">
          <router-link to="/login" class="btn-primary text-lg px-8 py-4">
            Launch Simulator
            <ArrowRightIcon class="w-5 h-5 inline ml-2" />
          </router-link>
          <button @click="scrollToFeatures" class="btn-secondary text-lg px-8 py-4">Explore Features</button>
        </div>
      </div>
      <div id="features" class="grid md:grid-cols-3 gap-6 mt-32">
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-medical-500/10 rounded-2xl flex items-center justify-center mb-6">
            <UserIcon class="w-7 h-7 text-medical-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Digital Twin Creation</h3>
          <p class="text-dark-400 leading-relaxed">Build patient-specific biological twins with organ-level granularity. Encode age, comorbidities, genetics, and lifestyle factors.</p>
        </div>
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-success-500/10 rounded-2xl flex items-center justify-center mb-6">
            <PillIcon class="w-7 h-7 text-success-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Drug Simulation</h3>
          <p class="text-dark-400 leading-relaxed">Predict treatment outcomes before administration. Model drug-organ interactions, toxicity, and trajectory over time.</p>
        </div>
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-warning-500/10 rounded-2xl flex items-center justify-center mb-6">
            <BrainIcon class="w-7 h-7 text-warning-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Explainable AI</h3>
          <p class="text-dark-400 leading-relaxed">Understand why AI makes decisions. Causal reasoning, SHAP values, and risk factor analysis for every prediction.</p>
        </div>
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-medical-500/10 rounded-2xl flex items-center justify-center mb-6">
            <NetworkIcon class="w-7 h-7 text-medical-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Federated Learning</h3>
          <p class="text-dark-400 leading-relaxed">Train models across hospital networks without sharing patient data. Real-time sync visualization and global model aggregation.</p>
        </div>
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-danger-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheckIcon class="w-7 h-7 text-danger-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Governance & Voting</h3>
          <p class="text-dark-400 leading-relaxed">Decentralized clinical protocol voting. Doctors vote on treatment guidelines with full audit trails and transparency.</p>
        </div>
        <div class="glass-panel p-8 card-hover">
          <div class="w-14 h-14 bg-success-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ActivityIcon class="w-7 h-7 text-success-400" />
          </div>
          <h3 class="text-xl font-bold mb-3">Real-time Vitals</h3>
          <p class="text-dark-400 leading-relaxed">Live organ health monitoring, vital signs, and trajectory charts. Animated anatomy with condition-based glow effects.</p>
        </div>
      </div>
      <div class="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="glass-panel p-6 text-center">
          <div class="text-3xl font-bold text-medical-400 mb-1">12,450+</div>
          <div class="text-sm text-dark-500">Digital Twins Created</div>
        </div>
        <div class="glass-panel p-6 text-center">
          <div class="text-3xl font-bold text-success-400 mb-1">6</div>
          <div class="text-sm text-dark-500">Hospital Networks</div>
        </div>
        <div class="glass-panel p-6 text-center">
          <div class="text-3xl font-bold text-warning-400 mb-1">91%</div>
          <div class="text-sm text-dark-500">Prediction Accuracy</div>
        </div>
        <div class="glass-panel p-6 text-center">
          <div class="text-3xl font-bold text-danger-400 mb-1">34%</div>
          <div class="text-sm text-dark-500">Adverse Events Prevented</div>
        </div>
      </div>
    </main>
    <footer class="relative z-10 border-t border-dark-800 py-8">
      <div class="max-w-7xl mx-auto px-8 text-center text-dark-500 text-sm">
        CausalBioTwin — AI Healthcare Digital Twin Platform. Hackathon Demo 2024.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { DnaIcon, SparklesIcon, ArrowRightIcon, UserIcon, PillIcon, BrainIcon, NetworkIcon, ShieldCheckIcon, ActivityIcon } from 'lucide-vue-next'
function scrollToFeatures() {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
