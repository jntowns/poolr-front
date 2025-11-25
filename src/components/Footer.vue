<template>
    <footer class="bg-white border-t border-slate-100 py-8">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-slate-500 text-sm">
                &copy; {{ new Date().getFullYear() }} Poolr Group. All rights reserved.
            </div>
            <!-- TODO add actual pages for these -->
            <div class="flex gap-6 text-slate-500 text-sm font-medium">
                <a href="#" class="hover:text-slate-900 transition-colors">Privacy</a>
                <a href="#" class="hover:text-slate-900 transition-colors">Terms</a>
                <a href="#" class="hover:text-slate-900 transition-colors">Contact</a>
            </div>
        </div>
    </footer>
</template>