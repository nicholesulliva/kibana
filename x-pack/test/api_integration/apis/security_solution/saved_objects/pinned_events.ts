/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';

import { FtrProviderContext } from '../../../ftr_provider_context';
import { persistTimelinePinnedEventMutation } from '../../../../../plugins/security_solution/public/timelines/containers/pinned_event/persist.gql_query';

export default function ({ getService }: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const client = getService('securitySolutionGraphQLClient');

  describe('Pinned Events - Saved Objects', () => {
    beforeEach(() => esArchiver.load('empty_kibana'));
    afterEach(() => esArchiver.unload('empty_kibana'));

    describe('Pinned an event', () => {
      it('return a timelineId, timelineVersion, pinnedEventId and version', async () => {
        const response = await client.mutate<any>({
          mutation: persistTimelinePinnedEventMutation,
          variables: {
            pinnedEventId: null,
            eventId: 'bv4QSGsB9v5HJNSH-7fi',
          },
        });
        const { eventId, pinnedEventId, timelineId, timelineVersion, version } =
          response.data && response.data.persistPinnedEventOnTimeline;

        expect(eventId).to.be('bv4QSGsB9v5HJNSH-7fi');
        expect(pinnedEventId).to.not.be.empty();
        expect(timelineId).to.not.be.empty();
        expect(timelineVersion).to.not.be.empty();
        expect(version).to.not.be.empty();
      });
    });

    describe('Unpinned an event', () => {
      it('return null', async () => {
        const response = await client.mutate<any>({
          mutation: persistTimelinePinnedEventMutation,
          variables: {
            pinnedEventId: null,
            eventId: 'bv4QSGsB9v5HJNSH-7fi',
          },
        });
        const { eventId, pinnedEventId } =
          response.data && response.data.persistPinnedEventOnTimeline;

        const responseToTest = await client.mutate<any>({
          mutation: persistTimelinePinnedEventMutation,
          variables: {
            pinnedEventId,
            eventId,
          },
        });

        expect(responseToTest.data!.persistPinnedEventOnTimeline).to.be(null);
      });
    });
  });
}
