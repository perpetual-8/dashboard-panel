 <template>
  <div>
    <h2 class="mb-4">Dashboard</h2>

    <!-- Stat Cards -->
    <div class="row mb-4">
      <div class="col-md-6 col-lg-3">
        <StatCard title="Revenue Today" value="$1,234" trend="+12%" subtitle="vs Yesterday" />
      </div>
      <div class="col-md-6 col-lg-3">
        <StatCard title="Orders Today" value="56" trend="+8%" subtitle="vs Yesterday" />
      </div>
      <div class="col-md-6 col-lg-3">
        <StatCard title="Total Orders" value="1,234" trend="+12%" subtitle="vs Last Month" />
      </div>
      <div class="col-md-6 col-lg-3">
        <StatCard title="Total Sales" value="$78,910" trend="+10%" subtitle="vs Last Month" />
      </div>
    </div>

    <!-- Revenue Trends -->
    <h5 class="mt-4 mb-2">Revenue Trends</h5>
    <div class="row">
      <div class="col-md-6">
        <LineChart title="Orders Over Time" trend="+12%" />
      </div>
      <div class="col-md-6">
        <LineChart title="Sales Revenue Trend" trend="+8%" />
      </div>
    </div>

    <!-- Inventory -->
    <div class="row mt-4">
      <div class="col-12">
        <LineChart title="Inventory Level Over Time" trend="-5%" />
      </div>
    </div>

    <!-- Category Revenue -->
    <div class="mt-5">
       
      <CategoryRevenue />
    </div>
  </div>
</template>

<script setup>
import StatCard from '../components/ui/StatCard.vue'
import CategoryRevenue from '../components/ui/CategoryRevenue.vue'
import LineChart from '../components/ui/LineChart.vue'
</script>
