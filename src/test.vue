<template>
  <table>
    <thead>
      <th>filepath</th>
      <th>filesize</th>
    </thead>
    <tbody>
      <tr v-for="row in rows">
        <td>{{ row.filepath }}</td>
        <td>{{ row.filesize }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'test',
  data: {
    rows: []
  }
}
</script>
