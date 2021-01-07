# vue-element-move
vue-element-move

## Install
```
npm i vue-element-move
```

## Example

```html
<template>
  <!-- dialog -->
  <div v-move="() => $refs.dialog" ref="dialog">
  </div>
  <!-- dialog -->
</template>

<script>
import move from "vue-element-move";

export default {
  directives: {
    move
  }
  ...
}
</script>
```

## Options
set options to configure move

```html
<template>
  <div v-move="() => $refs.dialog" ref="dialog" move-out>
  </div>
</template>
```

| Name | Detail
| - | - |
| move-out | Allow move out of window |
| move-x-right | When moving, the X coordinate is calculated according to the right side |
| move-y-bottom | When moving, the Y coordinate is calculated according to the bottom |
| move-cursor | Cursor when moving |
