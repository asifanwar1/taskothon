export type WhiteboardProps = {
    initialData?: string | null;
    onSave?: (snapshot: string) => void;
    readOnly?: boolean;
    className?: string;
};
