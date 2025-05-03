const axios = require('axios');

class Youtube {
    async search(query) {
        try {
            const params = new URLSearchParams({
                q: query,
                vt: 'home',
            }).toString();

            const response = await axios.post('https://tomp3.icu/api/ajaxSearch/index', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Accept: '*/*',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = response.data;
            data.items = data.items.map((item) => ({
                ...item,
                youtubeUrl: `https://youtu.be/${item.v}`,
            }));

            return data;
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    }

    async download(url) {
        try {
            const serverResponse = await axios.post('https://proxy.ezmp3.cc/api/getServer', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const serverUrl = serverResponse.data.serverURL;
            const convertResponse = await axios.post(`${serverUrl}/api/convert`, {
                url,
                quality: 128,
                trim: false,
                startT: 0,
                endT: 0,
                videoLength: 0,
                restricted: false,
                code: 0,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const convertData = convertResponse.data;
            const title = convertData.title || new Date().toISOString();

            const downloadParams = `platform=youtube&url=${encodeURIComponent(url)}&title=${title}&id=YgEl3OEU2DA&ext=mp4&note=720p&format=136`;
            const downloadHeaders = {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-note': '720p',
                'x-requested-with': 'XMLHttpRequest',
                Referer: 'https://ssyoutube.com.co/en111bv/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            };

            const downloadResponse = await fetch('https://ssyoutube.com.co/mates/en/convert?id=YgEl3OEU2DA', {
                method: 'POST',
                headers: downloadHeaders,
                body: downloadParams,
            });

            const downloadData = await downloadResponse.json();

            const thumbnailResponse = await axios.post('https://seostudio.tools/livewire/message/public.tools.youtube-thumbnail-downloader', {
                fingerprint: {
                    id: 'K6HHi0NyRjKxHBCa4mTe',
                    name: 'public.tools.youtube-thumbnail-downloader',
                    locale: 'en',
                    path: 'youtube-thumbnail-downloader',
                    method: 'GET',
                    v: 'acj',
                },
                serverMemo: {
                    children: [],
                    errors: [],
                    htmlHash: '5dfca34c',
                    data: {
                        link: null,
                        data: [],
                        recaptcha: null,
                        generalSettings: [],
                    },
                    dataMeta: {
                        models: {
                            generalSettings: {
                                class: 'App\\Models\\Admin\\General',
                                id: 1,
                                relations: [],
                                connection: 'mysql',
                            },
                        },
                    },
                    checksum: '946c98802eac552a03ffe4e377350f7cccef82f731a6ebf8d2c5bcfd4817aeea',
                },
                updates: [
                    {
                        type: 'syncInput',
                        payload: {
                            id: 'tjy4g',
                            name: 'link',
                            value: url,
                        },
                    },
                    {
                        type: 'callMethod',
                        payload: {
                            id: '7xk4',
                            method: 'onYoutubeThumbnailDownloader',
                            params: [],
                        },
                    },
                ],
            }, {
                headers: {
                    authority: 'seostudio.tools',
                    accept: 'text/html, application/xhtml+xml',
                    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/json',
                    origin: 'https://seostudio.tools',
                    referer: 'https://seostudio.tools/youtube-thumbnail-downloader',
                    'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                    'x-csrf-token': 'r6eBtEQ3JSqnpSQzpGlgDR1k7SQ2hG8Zf20MkCkm',
                    'x-livewire': 'true',
                },
            });

            const thumbnailData = await thumbnailResponse.data;
            const thumbnails = thumbnailData.serverMemo.data.data.map((item) => ({
                preview: item.preview,
                resolution: item.resolution,
            }));

            const result = {
                title: convertData.title,
                thumbnail: thumbnails,
                mp3: convertResponse.data.url || 'MP3 URL not found',
                mp4: downloadData.downloadUrlX ? downloadData.downloadUrlX : 'No download options found',
            };

            return result;
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return null;
        }
    }
}

async function ytdl(url) {
let sigma = new Youtube()
let data = await sigma.download(url)
return data
}

module.exports = { ytdl }