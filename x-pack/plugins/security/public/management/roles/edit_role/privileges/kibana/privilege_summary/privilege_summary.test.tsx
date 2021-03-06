/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { mountWithIntl } from '@kbn/test/jest';
import { spacesManagerMock } from '../../../../../../../../spaces/public/spaces_manager/mocks';
import { getUiApi } from '../../../../../../../../spaces/public/ui_api';
import { createKibanaPrivileges } from '../../../../__fixtures__/kibana_privileges';
import { kibanaFeatures } from '../../../../__fixtures__/kibana_features';
import { RoleKibanaPrivilege } from '../../../../../../../common/model';
import { PrivilegeSummary } from '.';
import { findTestSubject } from '@kbn/test/jest';
import { PrivilegeSummaryTable } from './privilege_summary_table';
import { coreMock } from 'src/core/public/mocks';

const createRole = (roleKibanaPrivileges: RoleKibanaPrivilege[]) => ({
  name: 'some-role',
  elasticsearch: {
    cluster: [],
    indices: [],
    run_as: [],
  },
  kibana: roleKibanaPrivileges,
});

const spaces = [
  {
    id: 'default',
    name: 'Default Space',
    disabledFeatures: [],
  },
];
const spacesManager = spacesManagerMock.create();
const { getStartServices } = coreMock.createSetup();
const spacesApiUi = getUiApi({ spacesManager, getStartServices });

describe('PrivilegeSummary', () => {
  it('initially renders a button', () => {
    const kibanaPrivileges = createKibanaPrivileges(kibanaFeatures);

    const role = createRole([
      {
        base: ['all'],
        feature: {},
        spaces: ['default'],
      },
    ]);

    const wrapper = mountWithIntl(
      <PrivilegeSummary
        spaces={spaces}
        kibanaPrivileges={kibanaPrivileges}
        role={role}
        canCustomizeSubFeaturePrivileges={true}
        spacesApiUi={spacesApiUi}
      />
    );

    expect(findTestSubject(wrapper, 'viewPrivilegeSummaryButton')).toHaveLength(1);
    expect(wrapper.find(PrivilegeSummaryTable)).toHaveLength(0);
  });

  it('clicking the button renders the privilege summary table', () => {
    const kibanaPrivileges = createKibanaPrivileges(kibanaFeatures);

    const role = createRole([
      {
        base: ['all'],
        feature: {},
        spaces: ['default'],
      },
    ]);

    const wrapper = mountWithIntl(
      <PrivilegeSummary
        spaces={spaces}
        kibanaPrivileges={kibanaPrivileges}
        role={role}
        canCustomizeSubFeaturePrivileges={true}
        spacesApiUi={spacesApiUi}
      />
    );

    findTestSubject(wrapper, 'viewPrivilegeSummaryButton').simulate('click');
    expect(wrapper.find(PrivilegeSummaryTable)).toHaveLength(1);
  });
});
