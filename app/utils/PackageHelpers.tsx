// Really Looks like we want a very general approach to loading the MDX files. If so we can do a double param.
export type ValidPackages = "client" | "push" | "pwa" | "sw";
interface TypeGuardReadonlyArray<T> extends ReadonlyArray<T> {
  includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}
// This is a string literal coercion. We can use this to make sure that the package string we return is valid.
export type PackageData = {
  name: string;
  slug: ValidPackages;
  comingSoon: boolean;
  position: number;
};

export const valid_packages = ["client", "push", "pwa", "sw"] as unknown as TypeGuardReadonlyArray<ValidPackages>;

export const packages: Record<ValidPackages, PackageData> = {
  pwa: { name: "remix-pwa", slug: "pwa", comingSoon: false, position: 0 },
  sw: { name: "@remix-pwa/sw", slug: "sw", comingSoon: false, position: 1 },
  push: { name: "@remix-pwa/push", slug: "push", comingSoon: true, position: 2 },
  client: { name: "@remix-pwa/client", slug: "client", comingSoon: true, position: 3 }
};
