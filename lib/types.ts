export type DocHeading = {
  depth: number;
  id: string;
  title: string;
};

export type ZetaDoc = {
  slug: string;
  sourcePath: string;
  contentId: string;
  dateApproved: string;
  title: string;
  navigationTitle: string;
  description: string;
  keywords: string[];
  group: string;
  markdown: string;
  headings: DocHeading[];
  searchText: string;
};

export type DocGroup = {
  label: string;
  slugs: string[];
};

export type SearchItem = Pick<ZetaDoc, "slug" | "title" | "navigationTitle" | "description" | "group" | "searchText">;
