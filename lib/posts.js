import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
	const fileNames = fs.readdirSync(postsDirectory);

	const allPostsData = fileNames.map((fileName) => {
		const id = fileName.replace(/\.md$/, "");
		const fullPath = path.join(postsDirectory, fileName);
		const fileContentsStr = fs.readFileSync(fullPath, "utf-8");

		const postMeta = matter(fileContentsStr);

		return {
			id,
			...postMeta.data,
		};
	});

	return allPostsData.sort(({ date: d1 }, { date: d2 }) => {
		if (d1 < d2) {
			return 1;
		}

		if (d1 > d2) {
			return -1;
		}
		return 0;
	});
}

export function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDirectory);
	return fileNames.map((fileName) => {
		const id = fileName.replace(/.md$/, "");
		return {
			params: {
				id,
			},
		};
	});
}

export async function getPostData(id) {
	const fullPath = path.join(postsDirectory, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf-8");

	const matterResult = matter(fileContents);
	const processedContent = await remark()
		.use(html)
		.process(matterResult.content);

	const contentHtml = processedContent.toString();

	return {
		id,
		contentHtml,
		...matterResult.data,
	};
}
