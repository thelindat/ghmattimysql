<template>
  <div class="overflow-y-scroll">
    <div class="px-1 mb-2 mt-1">
      <span class="block text-xl font-medium">Database Optimization Recommendations</span>
      <span class="block text-sm font-light">
        Note that these might change with uptime. Monitor your server when changing variables.
      </span>
    </div>
    <div v-for="issue in issues" :key="issue.title" class="my-2 px-3">
      <span class="block font-medium">{{ issue.title }}</span>
      <span class="block">{{ issue.message }}</span>
    </div>
    <div v-if="issues.length === 0">
      No possible optimizations detected.
    </div>
  </div>
</template>

<script>
import analyzeDbSettings from '../mixins/analyzeDatabaseSettings';

export default {
  props: {
    resource: {
      type: String,
      default: 'ghmattimysql',
    },
  },
  data() {
    return {
      rawStatus: [],
      rawVariables: [],
      issues: [],
    };
  },
  computed: {
    status() {
      return this.rawStatus.reduce((acc, cv) => {
        if (cv.Variable_name && cv.Value) acc[cv.Variable_name] = cv.Value;
        return acc;
      }, {});
    },
    variables() {
      return this.rawVariables.reduce((acc, cv) => {
        if (cv.Variable_name && cv.Value) acc[cv.Variable_name] = cv.Value;
        return acc;
      }, {});
    },
    hasChanged() {
      if (this.rawStatus.length > 0 && this.rawVariables.length > 0) return true;
      return false;
    },
  },
  watch: {
    hasChanged() {
      if (!this.hasChanged) return;
      this.issues = analyzeDbSettings(this.status, this.variables);
    },
  },
  methods: {
    onStatusData({ status }) {
      this.rawStatus = status;
    },
    onVariableData({ variables }) {
      this.rawVariables = variables;
    },
  },
  mounted() {
    this.rawStatus = [];
    this.rawVariables = [];
    fetch(`http://${this.resource}/request-server-status`, {
      method: 'post',
      body: JSON.stringify({ request: true }),
    }).catch(() => false);

    this.listener = window.addEventListener('message', (event) => {
      const item = event.data || event.detail;
      if (item && this[item.type]) this[item.type](item);
    });
  },
  destroyed() {
    window.removeEventListener('message', this.listener);
  },
};
</script>
