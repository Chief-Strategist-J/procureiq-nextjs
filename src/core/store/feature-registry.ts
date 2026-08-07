interface FeatureModule {
  reducer: any;
  saga?: () => Generator;
}

const registry = new Map<string, FeatureModule>();

export const featureRegistry = {
  register(name: string, mod: FeatureModule) {
    registry.set(name, mod);
  },
  getAll() {
    return [...registry.entries()];
  },
};
