<template>
  <table>
    <thead>
      <th>filepath</th>
      <th>hash</th>
      <th>filesize</th>
    </thead>
    <tbody>
      <tr v-for="row in rows">
        <td class="filepath">{{ row.filepath }}</td>
        <td class="hash">{{ row.hash }}</td>
        <td class="filesize">{{ row.filesize }}</td>
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
