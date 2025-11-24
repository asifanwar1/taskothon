"use client";

import { Tldraw, type Editor, loadSnapshot, getSnapshot } from "tldraw";
import { useCallback, useRef } from "react";
import { WhiteboardProps } from "./Whiteboard.types";

const Whiteboard = ({
    initialData,
    onSave,
    readOnly = false,
    className = "",
}: WhiteboardProps) => {
    const editorRef = useRef<Editor | null>(null);

    const handleMount = useCallback(
        (editor: Editor) => {
            editorRef.current = editor;

            if (readOnly) {
                editor.updateInstanceState({ isReadonly: true });
            }

            if (initialData) {
                try {
                    const snapshot = JSON.parse(initialData);
                    loadSnapshot(editor.store, snapshot);
                } catch (error) {
                    console.error("Error loading whiteboard data:", error);
                }
            }

            if (onSave && !readOnly) {
                const unsubscribe = editor.store.listen(() => {
                    const snapshot = getSnapshot(editor.store);
                    onSave(JSON.stringify(snapshot));
                });

                return unsubscribe;
            }
        },
        [initialData, onSave, readOnly]
    );

    return (
        <div className={`tldraw__editor ${className}`}>
            <Tldraw onMount={handleMount} />
        </div>
    );
};

export default Whiteboard;
