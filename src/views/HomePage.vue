<template>
  <div class="min-h-screen" style="background: var(--page-bg)">
    <!-- Hero Section -->
    <div class="bg-midnight-blue text-pure-white">
      <div class="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 class="text-5xl font-bold mb-4">Poolr</h1>
        <p class="text-xl text-slate-gray mb-8">
          Share rides, save money, reduce emissions
        </p>
        <button
          @click="$router.push('/find-ride')"
          class="pushButton bg-electric-blue hover:bg-deep-blue text-pure-white font-semibold py-3 px-8 rounded-lg"
        >
          Get Started
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div
      class="max-w-6xl mx-auto px-4 py-16"
      style="background: var(--feature-section-bg)"
    >
      <h2
        class="text-3xl font-bold text-midnight-blue text-center mb-12"
        style="color: var(--title-color)"
      >
        Why Choose Poolr?
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">💰</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">Save Money</h3>
          <p class="text-slate-gray">
            Split costs and reduce your commute expenses
          </p>
        </div>
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">🌍</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">Go Green</h3>
          <p class="text-slate-gray">Reduce your carbon footprint together</p>
        </div>
        <div class="bg-pure-white p-6 rounded-lg shadow-md">
          <div class="text-soft-teal text-4xl mb-4">👥</div>
          <h3 class="text-xl font-semibold text-slate-blue mb-2">
            Meet People
          </h3>
          <p class="text-slate-gray">Connect with fellow commuters</p>
        </div>
      </div>
    </div>
  </div>
</template>
