<!--
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
-->

<script setup lang="ts">
import { iconAbout } from '@siemens/ix-icons/icons';
import { IxInputGroup } from '@siemens/ix-vue';
</script>

<template>
  <form className="needs-validation">
    <IxInputGroup>
      <input class="ix-form-control" type="text" />
      <span slot="input-end">
        <IxIcon :name="iconAbout" size="16"></IxIcon>
      </span>
    </IxInputGroup>
  </form>
</template>
