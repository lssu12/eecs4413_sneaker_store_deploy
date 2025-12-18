export const BASE_URL = 'http://localhost:8080'; 

export const getHeader= (overrideToken) => {
	const token = overrideToken || localStorage.getItem('token');
	return {
		Authorization: token ? `Bearer ${token}` : '',
		'Content-Type': 'application/json',
	};
}

const SNEAKER_IMAGE_MAP = {
	'air-max-90': '/images/sneakers/1.png',
	'ultraboost': '/images/sneakers/2.png',
	'air-jordan-1': '/images/sneakers/3.png',
	'air-force-1': '/images/sneakers/4.png',
	'stan-smith': '/images/sneakers/5.png',
	'yeezy-350': '/images/sneakers/6.png',
	'gel-kayano': '/images/sneakers/7.png',
	'nb-990': '/images/sneakers/8.png',
	'puma-suede': '/images/sneakers/9.png',
	'reebok-classic': '/images/sneakers/10.png',
};

const KNOWN_IMAGE_PATHS = new Set(Object.values(SNEAKER_IMAGE_MAP));
const DEFAULT_IMAGE = SNEAKER_IMAGE_MAP['air-max-90'];

const slugify = (value = '') =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const extractSlugFromUrl = (url = '') => {
	if (!url) return '';
	const sections = url.split('/');
	const fileName = sections[sections.length - 1] || '';
	if (!fileName) return '';
	const [slug] = fileName.split('.');
	return slug;
};

export const resolveSneakerImage = (imageUrl, name = '') => {
	const normalized = (imageUrl || '').trim();

	if (normalized && !normalized.startsWith('/images/sneakers/')) {
		return normalized;
	}

	if (normalized && KNOWN_IMAGE_PATHS.has(normalized)) {
		return normalized;
	}

	const needsMapping =
		normalized && normalized.endsWith('.jpg') && normalized.startsWith('/images/sneakers/');
	const slugFromUrl = needsMapping ? extractSlugFromUrl(normalized) : '';
	const slug = slugFromUrl || slugify(name);

	if (slug && SNEAKER_IMAGE_MAP[slug]) {
		return SNEAKER_IMAGE_MAP[slug];
	}

	if (normalized) {
		return normalized;
	}

	return DEFAULT_IMAGE;
};
