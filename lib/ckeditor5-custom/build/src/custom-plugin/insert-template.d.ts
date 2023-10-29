import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor//ckeditor5-widget';
export default class InsertTemplate extends Plugin {
    static get pluginName(): string;
    static get requires(): (typeof Widget)[];
    init(): void;
    _defineSchema(): void;
    _defineConverters(): void;
}
