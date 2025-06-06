/*
 * SPDX-FileCopyrightText: 2023 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  iconError,
  iconInfo,
  iconQuestion,
  iconSuccess,
  iconWarning,
} from '@siemens/ix-icons/icons';
import { getCoreDelegate } from '../delegate';
import { TypedEvent } from '../typed-event';
import { ModalConfig } from './modal';

export type MessageConfig<T> = Omit<
  ModalConfig<T, unknown>,
  'content' | 'title'
> &
  MessageContent;

function setA11yAttributes(element: HTMLElement, config: MessageContent) {
  const ariaDescribedby = config.ariaDescribedby;
  const ariaLabelledby = config.ariaLabelledby;

  delete config['ariaDescribedby'];
  delete config['ariaLabelledby'];

  if (ariaDescribedby) {
    element.setAttribute('aria-describedby', ariaDescribedby);
  }

  if (ariaLabelledby) {
    element.setAttribute('aria-labelledby', ariaLabelledby);
  }
}

function createConfirmButtons(
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) {
  let actions: MessageAction[] = [];

  if (textCancel !== undefined) {
    actions = [
      ...actions,
      {
        id: 'cancel',
        text: textCancel,
        type: 'cancel',
        payload: payloadCancel,
      } as MessageAction,
    ];
  }
  return [
    ...actions,
    {
      id: 'okay',
      text: textOkay,
      type: 'okay',
      payload: payloadOkay,
    } as MessageAction,
  ];
}

export type MessageAction = {
  id: string;
  type: 'button-primary' | 'button-secondary' | 'okay' | 'cancel';
  text: string;
  payload?: any;
};

export type MessageContent = {
  icon: string;
  iconColor?: string;
  messageTitle: string;
  message: string;
  actions: MessageAction[];
  ariaLabelledby?: string;
  ariaDescribedby?: string;
};

export async function showMessage<T>(config: MessageConfig<T>) {
  const onMessageAction = new TypedEvent<{
    actionId: string;
    payload: T;
  }>();
  const dialog = document.createElement('ix-modal');
  const header = document.createElement('ix-modal-header');
  const content = document.createElement('ix-modal-content');
  const footer = document.createElement('ix-modal-footer');

  setA11yAttributes(dialog, config);

  Object.assign(header, config);
  Object.assign(content, config);
  Object.assign(footer, config);

  header.innerText = config.messageTitle;
  content.innerText = config.message;

  config.actions.forEach(({ id, text, type, payload }) => {
    const button = document.createElement('ix-button');
    button.innerText = text;
    footer.appendChild(button);

    if (type === 'okay') {
      button.variant = 'primary';
      button.addEventListener('click', () =>
        dialog.closeModal({
          actionId: id,
          payload,
        })
      );
      return;
    } else if (type === 'cancel') {
      button.variant = 'primary';
      button.outline = true;
      button.addEventListener('click', () =>
        dialog.dismissModal({
          actionId: id,
          payload,
        })
      );
      return;
    }
  });

  dialog.appendChild(header);
  dialog.appendChild(content);
  dialog.appendChild(footer);

  const dialogRef =
    await getCoreDelegate().attachView<HTMLIxModalElement>(dialog);

  dialogRef.addEventListener(
    'dialogClose',
    (
      event: CustomEvent<{
        actionId: string;
        payload: T;
      }>
    ) => {
      onMessageAction.emit(event.detail);
      dialogRef.remove();
    }
  );

  dialogRef.addEventListener(
    'dialogDismiss',
    (
      event: CustomEvent<{
        actionId: string;
        payload: T;
      }>
    ) => {
      onMessageAction.emit(event.detail);
      dialogRef.remove();
    }
  );

  setA11yAttributes(dialogRef, config);
  Object.assign(dialogRef, config);

  dialogRef.showModal();
  return onMessageAction;
}

showMessage.info = (
  title: string,
  message: string,
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) => {
  return showMessage({
    message,
    messageTitle: title,
    icon: iconInfo,
    actions: createConfirmButtons(
      textOkay,
      textCancel,
      payloadOkay,
      payloadCancel
    ),
  });
};

showMessage.warning = (
  title: string,
  message: string,
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) => {
  return showMessage({
    message,
    messageTitle: title,
    icon: iconWarning,
    iconColor: 'color-warning',
    actions: createConfirmButtons(
      textOkay,
      textCancel,
      payloadOkay,
      payloadCancel
    ),
  });
};

showMessage.error = (
  title: string,
  message: string,
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) => {
  return showMessage({
    message,
    messageTitle: title,
    icon: iconError,
    iconColor: 'color-alarm',
    actions: createConfirmButtons(
      textOkay,
      textCancel,
      payloadOkay,
      payloadCancel
    ),
  });
};

showMessage.success = (
  title: string,
  message: string,
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) => {
  return showMessage({
    message,
    messageTitle: title,
    icon: iconSuccess,
    iconColor: 'color-success',
    actions: createConfirmButtons(
      textOkay,
      textCancel,
      payloadOkay,
      payloadCancel
    ),
  });
};

showMessage.question = (
  title: string,
  message: string,
  textOkay: string,
  textCancel?: string,
  payloadOkay?: any,
  payloadCancel?: any
) => {
  return showMessage({
    message,
    messageTitle: title,
    icon: iconQuestion,
    actions: createConfirmButtons(
      textOkay,
      textCancel,
      payloadOkay,
      payloadCancel
    ),
  });
};
