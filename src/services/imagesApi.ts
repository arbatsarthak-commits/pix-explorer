import axios from 'axios';
import {ImageItem} from '../types/image';

const BASE = 'https://picsum.photos/v2';
const map = (x: any): ImageItem => ({id: String(x.id), author: String(x.author), url: String(x.download_url)});

export async function fetchPicsumImages(params: {page: number; limit: number}): Promise<ImageItem[]> {
  const res = await axios.get(`${BASE}/list`, {params, timeout: 15000});
  return (res.data ?? []).map(map);
}

export async function fetchPicsumImageById(imageId: string): Promise<ImageItem> {
  const res = await axios.get(`${BASE}/list`, {params: {page: 1, limit: 100}, timeout: 15000});
  const found = (res.data ?? []).find((x: any) => String(x.id) === imageId);
  return found ? map(found) : {id: imageId, author: 'Unknown', url: `https://picsum.photos/id/${imageId}/800/600`};
}
