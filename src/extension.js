"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.deactivate = exports.activate = void 0;
var vscode = require("vscode");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var os = require("os");
var nextjs_templates_1 = require("./templates/nextjs-templates");
function activate(context) {
    var _this = this;
    console.log("Enhanced File Structure Generator extension is now active");
    // Load extension settings
    var settings = {
        createEmptyFiles: true,
        createIntermediateDirectories: true,
        overwriteExisting: false,
        parseComments: true,
        ignoreBlankLines: true,
        defaultTemplates: {
            // Default templates for common file types
            ".tsx": 'import React from "react";\n\nconst Component = () => {\n  return (\n    <div>\n      \n    </div>\n  );\n};\n\nexport default Component;',
            ".ts": "export {};",
            ".js": "// JavaScript file",
            ".jsx": 'import React from "react";\n\nfunction Component() {\n  return (\n    <div>\n      \n    </div>\n  );\n}\n\nexport default Component;',
            ".css": "/* Styles */",
            ".html": '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n</head>\n<body>\n  \n</body>\n</html>'
        },
        getTemplateForFile: function (fileName) {
            var ext = path.extname(fileName);
            return this.defaultTemplates[ext] || "";
        }
    };
    // Register Next.js templates into settings
    (0, nextjs_templates_1.registerNextJsTemplates)(settings);
    // Register the Next.js specific template command
    var nextjsCommand = vscode.commands.registerCommand("extension.createNextJsProject", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createNextJsProjectCommand(context, settings)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Register commands for generating and configuring file structure
    var generateCommand = vscode.commands.registerCommand("extension.generateFileStructure", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateFileStructureCommand(context, settings)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var configureCommand = vscode.commands.registerCommand("extension.configureFileGenerator", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configureGeneratorCommand(context, settings)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var importTemplatesCmd = vscode.commands.registerCommand("extension.importTemplates", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importTemplatesCommand(context, settings)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    context.subscriptions.push(generateCommand, configureCommand, nextjsCommand, importTemplatesCmd);
    // Register status bar item for quick access
    var statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(file-directory) Generate Files";
    statusBarItem.tooltip = "Generate file structure from current text";
    statusBarItem.command = "extension.generateFileStructure";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}
exports.activate = activate;
// Command to import additional templates from a JSON or JS/TS file
function importTemplatesCommand(context, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var options, fileUri, filePath, ext, content, templates_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        canSelectMany: false,
                        openLabel: "Import",
                        filters: {
                            "Template Files": ["js", "ts", "json"]
                        }
                    };
                    return [4 /*yield*/, vscode.window.showOpenDialog(options)];
                case 1:
                    fileUri = _a.sent();
                    if (fileUri && fileUri[0]) {
                        try {
                            filePath = fileUri[0].fsPath;
                            ext = path.extname(filePath);
                            if (ext === ".json") {
                                content = fs.readFileSync(filePath, "utf8");
                                templates_1 = JSON.parse(content);
                                // Merge imported templates into default templates
                                Object.keys(templates_1).forEach(function (key) {
                                    settings.defaultTemplates[key] = templates_1[key];
                                });
                                vscode.window.showInformationMessage("Imported ".concat(Object.keys(templates_1).length, " templates from JSON file"));
                            }
                            else if (ext === ".js" || ext === ".ts") {
                                // For JS/TS template files, instruct user to manually integrate them
                                vscode.window.showInformationMessage("JavaScript/TypeScript template files need to be manually added to your project");
                            }
                        }
                        catch (error) {
                            vscode.window.showErrorMessage("Error importing templates: ".concat(error instanceof Error ? error.message : String(error)));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Command to configure the generator settings interactively
function configureGeneratorCommand(context, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var options, choice, _a, extension, template;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = [
                        "Add File Template",
                        "Toggle Empty Files",
                        "Toggle Overwrite Existing",
                        "Reset to Defaults",
                    ];
                    return [4 /*yield*/, vscode.window.showQuickPick(options, {
                            placeHolder: "Select an option"
                        })];
                case 1:
                    choice = _b.sent();
                    if (!choice)
                        return [2 /*return*/];
                    _a = choice;
                    switch (_a) {
                        case "Add File Template": return [3 /*break*/, 2];
                        case "Toggle Empty Files": return [3 /*break*/, 5];
                        case "Toggle Overwrite Existing": return [3 /*break*/, 6];
                        case "Reset to Defaults": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, vscode.window.showInputBox({
                        prompt: "Enter file extension (e.g., .tsx)"
                    })];
                case 3:
                    extension = _b.sent();
                    if (!extension)
                        return [2 /*return*/];
                    return [4 /*yield*/, vscode.window.showInputBox({
                            prompt: "Enter template content for ".concat(extension, " files")
                        })];
                case 4:
                    template = _b.sent();
                    if (template === undefined)
                        return [2 /*return*/];
                    settings.defaultTemplates[extension] = template;
                    vscode.window.showInformationMessage("Template for ".concat(extension, " files saved"));
                    return [3 /*break*/, 8];
                case 5:
                    settings.createEmptyFiles = !settings.createEmptyFiles;
                    vscode.window.showInformationMessage("Empty file creation: ".concat(settings.createEmptyFiles ? "Enabled" : "Disabled"));
                    return [3 /*break*/, 8];
                case 6:
                    settings.overwriteExisting = !settings.overwriteExisting;
                    vscode.window.showInformationMessage("Overwrite existing files: ".concat(settings.overwriteExisting ? "Enabled" : "Disabled"));
                    return [3 /*break*/, 8];
                case 7:
                    // Reset settings to default values
                    settings.createEmptyFiles = true;
                    settings.createIntermediateDirectories = true;
                    settings.overwriteExisting = false;
                    settings.parseComments = true;
                    settings.ignoreBlankLines = true;
                    vscode.window.showInformationMessage("Settings reset to defaults");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Main command to generate file structure from an ASCII tree
function generateFileStructureCommand(context, settings) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var editor, document, text, workspaceFolder, baseDirInput, basePath_1, _b, structure_1, inlineContent_1, fileCount_1, dirCount_1, proceed, action, error_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showErrorMessage("No active editor found");
                        return [2 /*return*/];
                    }
                    document = editor.document;
                    text = document.getText();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    workspaceFolder = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
                    if (!workspaceFolder) {
                        vscode.window.showErrorMessage("No workspace folder found");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, vscode.window.showInputBox({
                            prompt: "Enter base directory for file structure (relative to workspace root)",
                            placeHolder: "Leave empty to use workspace root",
                            value: ""
                        })];
                case 2:
                    baseDirInput = _c.sent();
                    basePath_1 = baseDirInput
                        ? path.join(workspaceFolder.uri.fsPath, baseDirInput)
                        : workspaceFolder.uri.fsPath;
                    _b = parseFileStructureAdvanced(text, settings), structure_1 = _b.structure, inlineContent_1 = _b.inlineContent;
                    if (Object.keys(structure_1).length === 0) {
                        vscode.window.showWarningMessage("No valid file structure detected. Check your file format.");
                        return [2 /*return*/];
                    }
                    fileCount_1 = countFiles(structure_1);
                    dirCount_1 = countDirectories(structure_1);
                    return [4 /*yield*/, vscode.window.showInformationMessage("Ready to create ".concat(fileCount_1, " files and ").concat(dirCount_1, " directories in \"").concat(basePath_1, "\". Proceed?"), "Yes", "No")];
                case 3:
                    proceed = _c.sent();
                    if (proceed !== "Yes")
                        return [2 /*return*/];
                    // Create files and directories with progress indication
                    return [4 /*yield*/, vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Generating file structure",
                            cancellable: true
                        }, function (progress, token) { return __awaiter(_this, void 0, void 0, function () {
                            var total, current;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        total = fileCount_1 + dirCount_1;
                                        current = 0;
                                        return [4 /*yield*/, generateFileStructureWithProgress(structure_1, basePath_1, settings, inlineContent_1, function (message) {
                                                current++;
                                                progress.report({
                                                    message: message,
                                                    increment: 100 / total
                                                });
                                            }, token)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, new Promise(function (resolve) {
                                                setTimeout(function () { return resolve(); }, 500);
                                            })];
                                }
                            });
                        }); })];
                case 4:
                    // Create files and directories with progress indication
                    _c.sent();
                    return [4 /*yield*/, vscode.window.showInformationMessage("File structure created successfully!", "Open in Explorer", "Done")];
                case 5:
                    action = _c.sent();
                    if (action === "Open in Explorer") {
                        vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(basePath_1));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    vscode.window.showErrorMessage("Error generating file structure: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Command to create a Next.js project structure
function createNextJsProjectCommand(context, settings) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var workspaceFolder, baseDirInput, basePath, projectType, projectStructure, tmpFile, doc, _b, structure, inlineContent, fileCount, dirCount, proceed, action;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    workspaceFolder = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
                    if (!workspaceFolder) {
                        vscode.window.showErrorMessage("No workspace folder found");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, vscode.window.showInputBox({
                            prompt: "Enter directory for Next.js project (relative to workspace root)",
                            placeHolder: "Leave empty to use workspace root",
                            value: ""
                        })];
                case 1:
                    baseDirInput = _c.sent();
                    basePath = baseDirInput
                        ? path.join(workspaceFolder.uri.fsPath, baseDirInput)
                        : workspaceFolder.uri.fsPath;
                    return [4 /*yield*/, vscode.window.showQuickPick([
                            {
                                label: "Basic Next.js App",
                                detail: "Simple app with home page and basic components"
                            },
                            {
                                label: "Full-stack Next.js App",
                                detail: "Includes API routes, authentication, database setup"
                            },
                            {
                                label: "Next.js Dashboard",
                                detail: "Admin dashboard with charts and data tables"
                            },
                            { label: "Next.js Blog", detail: "Blog template with MDX support" },
                        ], { placeHolder: "Select a Next.js project template" })];
                case 2:
                    projectType = _c.sent();
                    if (!projectType)
                        return [2 /*return*/];
                    switch (projectType.label) {
                        case "Basic Next.js App":
                            projectStructure = (0, nextjs_templates_1.getBasicNextJsStructure)();
                            break;
                        case "Full-stack Next.js App":
                            projectStructure = (0, nextjs_templates_1.getFullStackNextJsStructure)();
                            break;
                        case "Next.js Dashboard":
                            projectStructure = (0, nextjs_templates_1.getNextJsDashboardStructure)();
                            break;
                        case "Next.js Blog":
                            projectStructure = (0, nextjs_templates_1.getNextJsBlogStructure)();
                            break;
                        default:
                            projectStructure = (0, nextjs_templates_1.getBasicNextJsStructure)();
                    }
                    tmpFile = path.join(os.tmpdir(), "nextjs-structure-".concat(crypto.randomBytes(4).toString("hex"), ".txt"));
                    fs.writeFileSync(tmpFile, projectStructure);
                    return [4 /*yield*/, vscode.workspace.openTextDocument(tmpFile)];
                case 3:
                    doc = _c.sent();
                    return [4 /*yield*/, vscode.window.showTextDocument(doc)];
                case 4:
                    _c.sent();
                    _b = parseFileStructureAdvanced(projectStructure, settings), structure = _b.structure, inlineContent = _b.inlineContent;
                    fileCount = countFiles(structure);
                    dirCount = countDirectories(structure);
                    return [4 /*yield*/, vscode.window.showInformationMessage("Ready to create a ".concat(projectType.label, " with ").concat(fileCount, " files and ").concat(dirCount, " directories in \"").concat(basePath, "\". Proceed?"), "Yes", "No")];
                case 5:
                    proceed = _c.sent();
                    if (proceed !== "Yes")
                        return [2 /*return*/];
                    return [4 /*yield*/, vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Generating Next.js project structure",
                            cancellable: true
                        }, function (progress, token) { return __awaiter(_this, void 0, void 0, function () {
                            var total, current;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        total = fileCount + dirCount;
                                        current = 0;
                                        return [4 /*yield*/, generateFileStructureWithProgress(structure, basePath, settings, inlineContent, function (message) {
                                                current++;
                                                progress.report({
                                                    message: message,
                                                    increment: 100 / total
                                                });
                                            }, token)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, new Promise(function (resolve) {
                                                setTimeout(function () { return resolve(); }, 500);
                                            })];
                                }
                            });
                        }); })];
                case 6:
                    _c.sent();
                    fs.unlinkSync(tmpFile);
                    return [4 /*yield*/, vscode.window.showInformationMessage("Next.js project structure created successfully!", "Open in Explorer", "Done")];
                case 7:
                    action = _c.sent();
                    if (action === "Open in Explorer") {
                        vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(basePath));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Advanced parser that handles inline file content blocks
function parseFileStructureAdvanced(text, settings) {
    var lines = text.split("\n");
    var root = {};
    var inlineContent = new Map();
    var levels = {};
    var currentBlock = [];
    var currentFilePath = null;
    var isCollectingContent = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (isCollectingContent) {
            if (line.trim() === "```" || line.trim() === "---EOF---") {
                if (currentFilePath) {
                    inlineContent.set(currentFilePath, currentBlock.join("\n"));
                }
                isCollectingContent = false;
                currentBlock = [];
                currentFilePath = null;
                continue;
            }
            currentBlock.push(line);
            continue;
        }
        if (settings.ignoreBlankLines && line.trim() === "")
            continue;
        if (settings.parseComments &&
            (line.trim().startsWith("//") || line.trim().startsWith("#")))
            continue;
        var isStructuredLine = line.includes("├") || line.includes("└") || line.includes("│");
        // Handle root directory line (e.g. "app/")
        if (!isStructuredLine && line.includes("/") && !line.includes(" ")) {
            var dirName = line.replace("/", "").trim();
            root[dirName] = {};
            levels[0] = { path: [dirName], obj: root[dirName] };
            continue;
        }
        if (!isStructuredLine)
            continue;
        var indentLevel = 0;
        for (var j = 0; j < line.length; j++) {
            if (line[j] === "├" || line[j] === "└" || line[j] === "│") {
                indentLevel = Math.floor(j / 2);
                break;
            }
        }
        var name_1 = line
            .replace(/[├└]─\s+/, "")
            .replace(/│\s+/, "")
            .trim();
        var isDirectory = name_1.endsWith("/");
        if (isDirectory) {
            name_1 = name_1.slice(0, -1);
        }
        var commentPos = name_1.indexOf(" //");
        if (commentPos > -1)
            name_1 = name_1.substring(0, commentPos).trim();
        var parentLevel = indentLevel - 1;
        if (parentLevel >= 0 && levels[parentLevel]) {
            var _a = levels[parentLevel], parentPath = _a.path, parentObj = _a.obj;
            if (isDirectory) {
                parentObj[name_1] = {};
                levels[indentLevel] = {
                    path: __spreadArray(__spreadArray([], parentPath, true), [name_1], false),
                    obj: parentObj[name_1]
                };
            }
            else {
                parentObj[name_1] = "";
                currentFilePath = __spreadArray(__spreadArray([], parentPath, true), [name_1], false).join("/");
                if (i + 1 < lines.length && lines[i + 1].trim() === "```") {
                    isCollectingContent = true;
                    i++;
                }
            }
        }
        else if (indentLevel === 0) {
            if (isDirectory) {
                root[name_1] = {};
                levels[0] = { path: [name_1], obj: root[name_1] };
            }
            else {
                root[name_1] = "";
                currentFilePath = name_1;
                if (i + 1 < lines.length && lines[i + 1].trim() === "```") {
                    isCollectingContent = true;
                    i++;
                }
            }
        }
    }
    return { structure: root, inlineContent: inlineContent };
}
// Recursively create directories and files with progress updates
function generateFileStructureWithProgress(structure, basePath, settings, inlineContent, reportProgress, token) {
    return __awaiter(this, void 0, void 0, function () {
        function createRecursive(structure, currentPath) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, _b, name_2, content, fullPath, relativePath, dirPath, fileContent, mapKey, nextjsTemplate, templateContent, ext;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _i = 0, _a = Object.entries(structure);
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            _b = _a[_i], name_2 = _b[0], content = _b[1];
                            if (token.isCancellationRequested)
                                return [2 /*return*/];
                            fullPath = path.join(currentPath, name_2);
                            relativePath = path.relative(basePath, fullPath);
                            if (!(typeof content === "object")) return [3 /*break*/, 3];
                            if (!fs.existsSync(fullPath)) {
                                fs.mkdirSync(fullPath, { recursive: true });
                                reportProgress("Created directory: ".concat(relativePath));
                            }
                            return [4 /*yield*/, createRecursive(content, fullPath)];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            if (!fs.existsSync(fullPath) || settings.overwriteExisting) {
                                dirPath = path.dirname(fullPath);
                                if (!fs.existsSync(dirPath)) {
                                    fs.mkdirSync(dirPath, { recursive: true });
                                }
                                fileContent = "";
                                mapKey = relativePath.replace(/\\/g, "/");
                                if (inlineContent.has(mapKey)) {
                                    fileContent = inlineContent.get(mapKey) || "";
                                }
                                else {
                                    nextjsTemplate = (0, nextjs_templates_1.getNextJsTemplate)(fullPath);
                                    if (nextjsTemplate) {
                                        fileContent = nextjsTemplate;
                                    }
                                    else {
                                        templateContent = settings.getTemplateForFile(fullPath);
                                        if (templateContent) {
                                            fileContent = templateContent;
                                        }
                                        else {
                                            ext = path.extname(name_2);
                                            if (settings.defaultTemplates[ext]) {
                                                fileContent = settings.defaultTemplates[ext];
                                            }
                                        }
                                    }
                                }
                                // Optionally create empty file if no content is provided
                                if (!fileContent && settings.createEmptyFiles) {
                                    fileContent = "";
                                }
                                fs.writeFileSync(fullPath, fileContent);
                                reportProgress("Created file: ".concat(relativePath));
                            }
                            else {
                                reportProgress("Skipped existing file: ".concat(relativePath));
                            }
                            _c.label = 4;
                        case 4: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5); })];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createRecursive(structure, basePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Utility functions to count files and directories
function countFiles(structure) {
    var count = 0;
    for (var _i = 0, _a = Object.entries(structure); _i < _a.length; _i++) {
        var _b = _a[_i], _ = _b[0], content = _b[1];
        if (typeof content === "object") {
            count += countFiles(content);
        }
        else {
            count++;
        }
    }
    return count;
}
function countDirectories(structure) {
    var count = 0;
    for (var _i = 0, _a = Object.entries(structure); _i < _a.length; _i++) {
        var _b = _a[_i], _ = _b[0], content = _b[1];
        if (typeof content === "object") {
            count++; // count this directory
            count += countDirectories(content);
        }
    }
    return count;
}
function deactivate() { }
exports.deactivate = deactivate;
