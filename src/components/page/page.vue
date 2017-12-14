<template>
    <div>{{val}}</div>
</template>
<script>
    export default {
        name:'page',
        data() {
            return {}
        },
        props:{
          val:{
            type:String,
            default: '233'
          }
        }
    }
</script>
