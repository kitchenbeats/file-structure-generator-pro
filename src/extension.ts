import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as os from "os";
import {
	registerNextJsTemplates,
	getNextJsTemplate,
	getBasicNextJsStructure,
	getFullStackNextJsStructure,
	getNextJsDashboardStructure,
	getNextJsBlogStructure,
} from "./templates/nextjs-templates";

// Define template types for different file extensions.
interface FileTemplates {
	[key: string]: string;
}

// Define default templates.
const defaultTemplates: FileTemplates = {
	".tsx":
		'import React from "react";\n\nconst Component = () => {\n  return (\n    <div>\n      \n    </div>\n  );\n};\n\nexport default Component;',
	".ts": "export {};",
	".js": "// JavaScript file",
	".jsx":
		'import React from "react";\n\nfunction Component() {\n  return (\n    <div>\n      \n    </div>\n  );\n}\n\nexport default Component;',
	".css": "/* Styles */",
	".html":
		'<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>',
};

// Global extension settings.
interface Settings {
	createEmptyFiles: boolean;
	createIntermediateDirectories: boolean;
	overwriteExisting: boolean;
	defaultTemplates: FileTemplates;
	parseComments: boolean;
	ignoreBlankLines: boolean;
	getTemplateForFile: (fileName: string) => string;
	debug?: boolean;
}

export function activate(context: vscode.ExtensionContext) {
	console.log("File Structure Generator Pro extension is now active");

	const settings: Settings = {
		createEmptyFiles: true,
		createIntermediateDirectories: true,
		overwriteExisting: false,
		parseComments: true,
		ignoreBlankLines: true,
		defaultTemplates,
		getTemplateForFile: (fileName: string): string => {
			const ext = path.extname(fileName);
			return defaultTemplates[ext] || "";
		},
	};

	// Register Next.js templates.
	registerNextJsTemplates(settings);

	// Register commands.
	const nextjsCommand = vscode.commands.registerCommand(
		"extension.createNextJsProject",
		async () => {
			await createNextJsProjectCommand(context, settings);
		}
	);
	const generateCommand = vscode.commands.registerCommand(
		"extension.generateFileStructure",
		async () => {
			await generateFileStructureCommand(context, settings);
		}
	);
	const configureCommand = vscode.commands.registerCommand(
		"extension.configureFileGenerator",
		async () => {
			await configureGeneratorCommand(context, settings);
		}
	);
	const importTemplatesCmd = vscode.commands.registerCommand(
		"extension.importTemplates",
		async () => {
			await importTemplatesCommand(context, settings);
		}
	);

	context.subscriptions.push(
		nextjsCommand,
		generateCommand,
		configureCommand,
		importTemplatesCmd
	);

	// Create a status bar item for quick access.
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);
	statusBarItem.text = "$(file-directory) Generate Files";
	statusBarItem.tooltip = "Generate file structure from current text";
	statusBarItem.command = "extension.generateFileStructure";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);
}

async function importTemplatesCommand(
	context: vscode.ExtensionContext,
	settings: Settings
) {
	const options: vscode.OpenDialogOptions = {
		canSelectMany: false,
		openLabel: "Import",
		filters: {
			"Template Files": ["js", "ts", "json"],
		},
	};

	const fileUri = await vscode.window.showOpenDialog(options);
	if (fileUri && fileUri[0]) {
		try {
			const filePath = fileUri[0].fsPath;
			const ext = path.extname(filePath);
			if (ext === ".json") {
				const content = fs.readFileSync(filePath, "utf8");
				const templates = JSON.parse(content);
				Object.keys(templates).forEach((key) => {
					settings.defaultTemplates[key] = templates[key];
				});
				vscode.window.showInformationMessage(
					`Imported ${Object.keys(templates).length} templates from JSON file`
				);
			} else if (ext === ".js" || ext === ".ts") {
				vscode.window.showInformationMessage(
					`JavaScript/TypeScript template files need to be manually added to your project`
				);
			}
		} catch (error) {
			vscode.window.showErrorMessage(
				`Error importing templates: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
		}
	}
}

async function configureGeneratorCommand(
	context: vscode.ExtensionContext,
	settings: Settings
) {
	const options = [
		"Add File Template",
		"Toggle Empty Files",
		"Toggle Overwrite Existing",
		"Reset to Defaults",
	];
	const choice = await vscode.window.showQuickPick(options, {
		placeHolder: "Select an option",
	});
	if (!choice) return;

	switch (choice) {
		case "Add File Template": {
			const extension = await vscode.window.showInputBox({
				prompt: "Enter file extension (e.g., .tsx)",
			});
			if (!extension) return;
			const template = await vscode.window.showInputBox({
				prompt: `Enter template content for ${extension} files`,
			});
			if (template === undefined) return;
			settings.defaultTemplates[extension] = template;
			vscode.window.showInformationMessage(
				`Template for ${extension} files saved`
			);
			break;
		}
		case "Toggle Empty Files":
			settings.createEmptyFiles = !settings.createEmptyFiles;
			vscode.window.showInformationMessage(
				`Empty file creation: ${
					settings.createEmptyFiles ? "Enabled" : "Disabled"
				}`
			);
			break;
		case "Toggle Overwrite Existing":
			settings.overwriteExisting = !settings.overwriteExisting;
			vscode.window.showInformationMessage(
				`Overwrite existing files: ${
					settings.overwriteExisting ? "Enabled" : "Disabled"
				}`
			);
			break;
		case "Reset to Defaults":
			settings.createEmptyFiles = true;
			settings.createIntermediateDirectories = true;
			settings.overwriteExisting = false;
			settings.parseComments = true;
			settings.ignoreBlankLines = true;
			vscode.window.showInformationMessage("Settings reset to defaults");
			break;
	}
}

async function generateFileStructureCommand(
	context: vscode.ExtensionContext,
	settings: Settings
) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("No active editor found");
		return;
	}
	const document = editor.document;
	const text = document.getText();

	try {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (!workspaceFolder) {
			vscode.window.showErrorMessage("No workspace folder found");
			return;
		}
		const baseDirInput = await vscode.window.showInputBox({
			prompt:
				"Enter base directory for file structure (relative to workspace root)",
			placeHolder: "Leave empty to use workspace root",
			value: "",
		});
		const basePath = baseDirInput
			? path.join(workspaceFolder.uri.fsPath, baseDirInput)
			: workspaceFolder.uri.fsPath;

		const { structure, inlineContent } = parseFileStructureAdvanced(
			text,
			settings
		);
		if (Object.keys(structure).length === 0) {
			vscode.window.showWarningMessage(
				"No valid file structure detected. Check your file format."
			);
			return;
		}
		const fileCount = countFiles(structure);
		const dirCount = countDirectories(structure);
		const proceed = await vscode.window.showInformationMessage(
			`Ready to create ${fileCount} files and ${dirCount} directories in "${basePath}". Proceed?`,
			"Yes",
			"No"
		);
		if (proceed !== "Yes") return;

		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: "Generating file structure",
				cancellable: true,
			},
			async (progress, token) => {
				const total = fileCount + dirCount;
				await generateFileStructureWithProgress(
					structure,
					basePath,
					settings,
					inlineContent,
					(message) => {
						progress.report({
							message,
							increment: 100 / total,
						});
					},
					token
				);
				return new Promise<void>((resolve) => {
					setTimeout(() => resolve(), 500);
				});
			}
		);

		const action = await vscode.window.showInformationMessage(
			"File structure created successfully!",
			"Open in Explorer",
			"Done"
		);
		if (action === "Open in Explorer") {
			vscode.commands.executeCommand(
				"revealFileInOS",
				vscode.Uri.file(basePath)
			);
		}
	} catch (error) {
		vscode.window.showErrorMessage(
			`Error generating file structure: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

async function createNextJsProjectCommand(
	context: vscode.ExtensionContext,
	settings: Settings
) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage("No workspace folder found");
		return;
	}
	const baseDirInput = await vscode.window.showInputBox({
		prompt: "Enter directory for Next.js project (relative to workspace root)",
		placeHolder: "Leave empty to use workspace root",
		value: "",
	});
	const basePath = baseDirInput
		? path.join(workspaceFolder.uri.fsPath, baseDirInput)
		: workspaceFolder.uri.fsPath;

	const projectType = await vscode.window.showQuickPick(
		[
			{
				label: "Basic Next.js App",
				detail: "Simple app with home page and basic components",
			},
			{
				label: "Full-stack Next.js App",
				detail: "Includes API routes, authentication, database setup",
			},
			{
				label: "Next.js Dashboard",
				detail: "Admin dashboard with charts and data tables",
			},
			{ label: "Next.js Blog", detail: "Blog template with MDX support" },
		],
		{ placeHolder: "Select a Next.js project template" }
	);
	if (!projectType) return;

	let projectStructure: string;
	switch (projectType.label) {
		case "Basic Next.js App":
			projectStructure = getBasicNextJsStructure();
			break;
		case "Full-stack Next.js App":
			projectStructure = getFullStackNextJsStructure();
			break;
		case "Next.js Dashboard":
			projectStructure = getNextJsDashboardStructure();
			break;
		case "Next.js Blog":
			projectStructure = getNextJsBlogStructure();
			break;
		default:
			projectStructure = getBasicNextJsStructure();
	}

	const tmpFile = path.join(
		os.tmpdir(),
		`nextjs-structure-${crypto.randomBytes(4).toString("hex")}.txt`
	);
	fs.writeFileSync(tmpFile, projectStructure);

	const doc = await vscode.workspace.openTextDocument(tmpFile);
	await vscode.window.showTextDocument(doc);

	const { structure, inlineContent } = parseFileStructureAdvanced(
		projectStructure,
		settings
	);
	const fileCount = countFiles(structure);
	const dirCount = countDirectories(structure);
	const proceed = await vscode.window.showInformationMessage(
		`Ready to create a ${projectType.label} with ${fileCount} files and ${dirCount} directories in "${basePath}". Proceed?`,
		"Yes",
		"No"
	);
	if (proceed !== "Yes") return;

	await vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: "Generating Next.js project structure",
			cancellable: true,
		},
		async (progress, token) => {
			const total = fileCount + dirCount;
			await generateFileStructureWithProgress(
				structure,
				basePath,
				settings,
				inlineContent,
				(message) => {
					progress.report({
						message,
						increment: 100 / total,
					});
				},
				token
			);
			return new Promise<void>((resolve) => {
				setTimeout(() => resolve(), 500);
			});
		}
	);

	fs.unlinkSync(tmpFile);

	const action = await vscode.window.showInformationMessage(
		"Next.js project structure created successfully!",
		"Open in Explorer",
		"Done"
	);
	if (action === "Open in Explorer") {
		vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(basePath));
	}
}

function parseFileStructureAdvanced(
	text: string,
	settings: Settings
): { structure: any; inlineContent: Map<string, string> } {
	const lines = text.split("\n");
	const inlineContent = new Map<string, string>();
	const structure: any = {};

	// Debugging output to trace the parsing process
	const debug = settings.debug || false;
	const log = debug ? (msg: string) => console.log(`[DEBUG] ${msg}`) : () => {};

	// Find the root folder line
	let rootLineIndex = 0;
	while (rootLineIndex < lines.length && lines[rootLineIndex].trim() === "") {
		rootLineIndex++;
	}
	if (rootLineIndex >= lines.length) {
		return { structure, inlineContent };
	}

	// Process the root name
	let rootName = lines[rootLineIndex].trim();
	if (rootName.endsWith("/")) {
		rootName = rootName.slice(0, -1);
	}
	log(`Root: ${rootName}`);

	structure[rootName] = {};

	// Keep track of the current working folder at each indent level
	// Key: indent level, Value: [current folder path components]
	const folderStack: { [level: number]: string[] } = {};
	folderStack[0] = [rootName];

	// Process each line after the root
	for (let i = rootLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Skip empty lines and comments
		if (
			(settings.ignoreBlankLines && trimmedLine === "") ||
			(settings.parseComments &&
				(trimmedLine.startsWith("//") || trimmedLine.startsWith("#")))
		) {
			continue;
		}

		// Skip lines without tree characters
		if (!line.includes("├") && !line.includes("└") && !line.includes("│")) {
			continue;
		}

		log(`Processing line: "${line}"`);

		// Simple indent level count: count leading spaces and tree chars
		let leadingContentCount = 0;
		for (let j = 0; j < line.length; j++) {
			const char = line[j];
			if (char === " " || char === "│" || char === "├" || char === "└") {
				leadingContentCount++;
			} else {
				break;
			}
		}

		// Indent level is determined by the number of space groups
		// Each level typically has 2 spaces + a tree character
		const level = Math.ceil(leadingContentCount / 3);

		log(`Detected level: ${level}`);

		// Extract name
		const nameMatch = line.match(/[├└]── *([^/\r\n]+\/?)/);
		if (!nameMatch || !nameMatch[1]) {
			log(`Could not extract name from line, skipping`);
			continue;
		}

		let name = nameMatch[1].trim();
		const isDirectory = name.endsWith("/");
		if (isDirectory) {
			name = name.slice(0, -1);
		}

		// Remove inline comments if any
		const commentPos = name.indexOf(" //");
		if (commentPos > -1) {
			name = name.substring(0, commentPos).trim();
		}

		log(`Name: "${name}", isDirectory: ${isDirectory}`);

		// Find the proper parent level
		let parentLevel = level - 1;
		while (parentLevel > 0 && !folderStack[parentLevel]) {
			parentLevel--;
		}

		const parentPath = folderStack[parentLevel] || folderStack[0];
		log(`Parent path: ${parentPath.join("/")}`);

		// Navigate to the proper location in the structure
		let currentObj = structure[rootName];
		for (let j = 1; j < parentPath.length; j++) {
			// Skip the root
			const segment = parentPath[j];
			currentObj = currentObj[segment];
		}

		// Add this item to the structure
		if (isDirectory) {
			currentObj[name] = {};
			folderStack[level] = [...parentPath, name];
			// Clear any deeper levels since the hierarchy has changed
			for (let l = level + 1; folderStack[l]; l++) {
				delete folderStack[l];
			}
			log(`Added directory "${name}" at level ${level}`);
		} else {
			currentObj[name] = "";
			log(`Added file "${name}" at level ${level}`);

			// Check for inline content
			if (i + 1 < lines.length && lines[i + 1].trim() === "```") {
				i++;
				const codeBlock: string[] = [];
				while (i + 1 < lines.length && lines[i + 1].trim() !== "```") {
					i++;
					codeBlock.push(lines[i]);
				}
				if (i + 1 < lines.length && lines[i + 1].trim() === "```") {
					i++;
				}

				// Reconstruct the path for this file
				const filePath = [...parentPath.slice(1), name].join("/"); // Skip root in path
				inlineContent.set(filePath, codeBlock.join("\n"));
				log(`Added inline content for "${filePath}"`);
			}
		}

		// Debug current state of the folder stack
		if (debug) {
			log(`Current folder stack:`);
			for (const [lvl, path] of Object.entries(folderStack)) {
				log(`  Level ${lvl}: ${path.join("/")}`);
			}
		}
	}

	// If debug is enabled, log the final structure
	if (debug) {
		log(`Final structure: ${JSON.stringify(structure, null, 2)}`);
	}

	return { structure, inlineContent };
}

async function generateFileStructureWithProgress(
	structure: any,
	basePath: string,
	settings: Settings,
	inlineContent: Map<string, string>,
	reportProgress: (message: string) => void,
	token: vscode.CancellationToken
): Promise<void> {
	async function createRecursive(
		structure: any,
		currentPath: string
	): Promise<void> {
		for (const [name, content] of Object.entries(structure)) {
			if (token.isCancellationRequested) return;

			const fullPath = path.join(currentPath, name);
			const relativePath = path.relative(basePath, fullPath);
			if (typeof content === "object") {
				if (!fs.existsSync(fullPath)) {
					fs.mkdirSync(fullPath, { recursive: true });
					reportProgress(`Created directory: ${relativePath}`);
				}
				await createRecursive(content, fullPath);
			} else {
				if (!fs.existsSync(fullPath) || settings.overwriteExisting) {
					const dirPath = path.dirname(fullPath);
					if (!fs.existsSync(dirPath)) {
						fs.mkdirSync(dirPath, { recursive: true });
					}
					let fileContent = "";
					const mapKey = relativePath.replace(/\\/g, "/");
					if (inlineContent.has(mapKey)) {
						fileContent = inlineContent.get(mapKey) || "";
					} else {
						const nextjsTemplate = getNextJsTemplate(fullPath);
						if (nextjsTemplate) {
							fileContent = nextjsTemplate;
						} else {
							const templateContent = settings.getTemplateForFile(fullPath);
							if (templateContent) {
								fileContent = templateContent;
							} else {
								const ext = path.extname(name);
								if (settings.defaultTemplates[ext]) {
									fileContent = settings.defaultTemplates[ext];
								}
							}
						}
					}
					if (!fileContent && settings.createEmptyFiles) {
						fileContent = "";
					}
					fs.writeFileSync(fullPath, fileContent);
					reportProgress(`Created file: ${relativePath}`);
				} else {
					reportProgress(`Skipped existing file: ${relativePath}`);
				}
			}
			await new Promise((resolve) => setTimeout(resolve, 5));
		}
	}
	await createRecursive(structure, basePath);
}

function countFiles(structure: any): number {
	let count = 0;
	for (const [_, content] of Object.entries(structure)) {
		if (typeof content === "object") {
			count += countFiles(content);
		} else {
			count++;
		}
	}
	return count;
}

function countDirectories(structure: any): number {
	let count = 0;
	for (const [_, content] of Object.entries(structure)) {
		if (typeof content === "object") {
			count++;
			count += countDirectories(content);
		}
	}
	return count;
}

export function deactivate() {}
