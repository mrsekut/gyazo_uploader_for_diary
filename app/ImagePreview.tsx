import { Card } from '../components/ui/card';
import { Image } from '../features/item/Image';

type Props = {
  file: File;
  gyazoUrl: string | null;
  onSelect: (selected: boolean, isShiftKey: boolean) => void;
  selected: boolean;
};

export const ImagePreview = ({ file, onSelect, selected, gyazoUrl }: Props) => {
  return (
    <Card
      className={`p-2 ${selected ? 'ring-2 ring-blue-500' : ''} cursor-pointer`}
      onClick={e => onSelect(!selected, e.shiftKey)}
    >
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <Image file={file} width={96} height={96} />
        </div>

        <div className="flex-grow flex flex-col justify-between h-24">
          <div>
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-gray-500 text-xs">
              {new Date(file.lastModified).toLocaleString()}
            </p>
            {gyazoUrl && (
              <p className="text-blue-500 text-xs truncate">
                <a href={gyazoUrl} target="_blank" rel="noopener noreferrer">
                  {gyazoUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
