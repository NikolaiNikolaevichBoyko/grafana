import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CoreApp, TimeZone, ExploreId, LoadingState } from '@grafana/data';
import { TabbedContainer, TabConfig } from '@grafana/ui';
import { ExploreDrawer } from 'app/features/explore/ExploreDrawer';
import { InspectDataTab } from 'app/features/inspector/InspectDataTab';
import { InspectErrorTab } from 'app/features/inspector/InspectErrorTab';
import { InspectJSONTab } from 'app/features/inspector/InspectJSONTab';
import { InspectStatsTab } from 'app/features/inspector/InspectStatsTab';
import { QueryInspector } from 'app/features/inspector/QueryInspector';
import { StoreState, ExploreItemState } from 'app/types';

import { runQueries } from './state/query';

interface DispatchProps {
  width: number;
  exploreId: ExploreId;
  timeZone: TimeZone;
  onClose: () => void;
}

type Props = DispatchProps & ConnectedProps<typeof connector>;

export function ExploreQueryInspector(props: Props) {
  const { width, onClose, queryResponse, timeZone } = props;
  const dataFrames = queryResponse?.series || [];
  const error = queryResponse?.error;

  const statsTab: TabConfig = {
    label: 'Stats',
    value: 'stats',
    icon: 'chart-line',
    content: <InspectStatsTab data={queryResponse!} timeZone={queryResponse?.request?.timezone as TimeZone} />,
  };

  const jsonTab: TabConfig = {
    label: 'JSON',
    value: 'json',
    icon: 'brackets-curly',
    content: <InspectJSONTab data={queryResponse} onClose={onClose} />,
  };

  const dataTab: TabConfig = {
    label: 'Data',
    value: 'data',
    icon: 'database',
    content: (
      <InspectDataTab
        data={dataFrames}
        isLoading={queryResponse.state === LoadingState.Loading || queryResponse.state === LoadingState.Streaming}
        options={{ withTransforms: false, withFieldConfig: false }}
        timeZone={timeZone}
        app={CoreApp.Explore}
      />
    ),
  };

  const queryTab: TabConfig = {
    label: 'Query',
    value: 'query',
    icon: 'info-circle',
    content: <QueryInspector data={dataFrames} onRefreshQuery={() => props.runQueries(props.exploreId)} />,
  };

  const tabs = [statsTab, queryTab, jsonTab, dataTab];
  if (error) {
    const errorTab: TabConfig = {
      label: 'Error',
      value: 'error',
      icon: 'exclamation-triangle',
      content: <InspectErrorTab error={error} />,
    };
    tabs.push(errorTab);
  }
  return (
    <ExploreDrawer width={width}>
      <TabbedContainer tabs={tabs} onClose={onClose} closeIconTooltip="Close query inspector" />
    </ExploreDrawer>
  );
}

function mapStateToProps(state: StoreState, { exploreId }: { exploreId: ExploreId }) {
  const explore = state.explore;
  const item: ExploreItemState = explore[exploreId]!;
  const { queryResponse } = item;

  return {
    queryResponse,
  };
}

const mapDispatchToProps = {
  runQueries,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ExploreQueryInspector);
