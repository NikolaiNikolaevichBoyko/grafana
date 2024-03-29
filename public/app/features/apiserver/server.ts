import { config, getBackendSrv } from '@grafana/runtime';

import {
  ListOptions,
  ListOptionsSelector,
  MetaStatus,
  Resource,
  ResourceForCreate,
  ResourceList,
  ResourceServer,
} from './types';

export interface GroupVersionResource {
  group: string;
  version: string;
  resource: string;
}

export class ScopedResourceServer<T = object, K = string> implements ResourceServer<T, K> {
  private _url: string;

  get url(): string {
    return this._url;
  }

  constructor(gvr: GroupVersionResource, namespaced = true) {
    const ns = namespaced ? `namespaces/${config.namespace}/` : '';

    this._url = `/apis/${gvr.group}/${gvr.version}/${ns}${gvr.resource}`;
  }

  public async create(obj: ResourceForCreate<T, K>): Promise<void> {
    return getBackendSrv().post(this.url, obj);
  }

  public async get(name: string): Promise<Resource<T, K>> {
    return getBackendSrv().get<Resource<T, K>>(`${this.url}/${name}`);
  }

  public async list(opts?: ListOptions | undefined): Promise<ResourceList<T, K>> {
    const finalOpts = opts || {};
    finalOpts.labelSelector = this.parseListOptionsSelector(finalOpts?.labelSelector);
    finalOpts.fieldSelector = this.parseListOptionsSelector(finalOpts?.fieldSelector);

    return getBackendSrv().get<ResourceList<T, K>>(this.url, opts);
  }

  public async update(obj: Resource<T, K>): Promise<Resource<T, K>> {
    return getBackendSrv().put<Resource<T, K>>(`${this.url}/${obj.metadata.name}`, obj);
  }

  public async delete(name: string): Promise<MetaStatus> {
    return getBackendSrv().delete<MetaStatus>(`${this.url}/${name}`);
  }

  // Allow overwriting the URL
  // There are situations where we might want to enforce another URL: allowing users to provide their own API implementation
  public overwriteUrl(url: string) {
    this._url = url;
  }

  private parseListOptionsSelector(labelSelector: ListOptionsSelector | undefined): string | undefined {
    if (!Array.isArray(labelSelector)) {
      return labelSelector;
    }

    return labelSelector
      .map((label) => {
        const key = String(label.key);
        const operator = label.operator;

        switch (operator) {
          case '=':
          case '!=':
            return `${key}${operator}${label.value}`;

          case 'in':
          case 'notin':
            return `${key}${operator}(${label.value.join(',')})`;

          case '':
          case '!':
            return `${operator}${key}`;

          default:
            return null;
        }
      })
      .filter(Boolean)
      .join(',');
  }
}
