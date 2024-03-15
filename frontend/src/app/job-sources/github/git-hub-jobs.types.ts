export type GitHubJob = {
  html_url: string;
  id: number;
  title: string;
  labels: string[];
  state: string;
  comments: number;
  created_at: string;
  closed_at: string;
  body: string;
};

export type GitHubCollections =
  | 'frontend'
  | 'backend'
  | 'soujava'
  | 'react-brasil'
  | 'androiddevbr';
