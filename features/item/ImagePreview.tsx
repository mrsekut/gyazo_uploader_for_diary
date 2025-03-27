import { Card } from '../../components/ui/card';
import { Image } from './Image';

type Props = {
  file: File;
  gyazoUrl: string | null;
  onSelect: (selected: boolean, isShiftKey: boolean) => void;
  selected: boolean;
};

export const ImagePreview = ({ file, onSelect, selected, gyazoUrl }: Props) => {
  const lastModified = new Date(file.lastModified).toLocaleString();

  return (
    <Card
      className={`p-2 h-44 w-48 ${
        selected ? 'ring-2 ring-blue-500' : ''
      } cursor-pointer overflow-hidden`}
      onClick={e => onSelect(!selected, e.shiftKey)}
    >
      <div className="flex flex-col gap-2">
        <div className="relative h-32 group">
          <Image file={file} />

          {/* hover */}
          <div className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
            <p className="text-sm font-medium text-white truncate w-full px-2">
              {file.name}
            </p>
            <p className="text-gray-200 text-xs">{lastModified}</p>
          </div>
        </div>

        {gyazoUrl && (
          <a
            className="text-blue-500 text-xs truncate"
            href={gyazoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {gyazoUrl}
          </a>
        )}
      </div>
    </Card>
  );
};
