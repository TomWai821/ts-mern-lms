import { Box, TextField, MenuItem } from '@mui/material';
import { ChangeEvent, FC } from 'react';
import { useDefinitionContext } from '../../../../Context/Book/DefinitionContext';
import { useContactContext } from '../../../../Context/Book/ContactContext';
import { displayAsColumn, optionFieldSlotProps } from '../../../../Data/Style';

interface BookDataSectionProps
{
    book: Record<string, any>;
    isSubmitted: boolean;
    errors: Record<string, string>;
    helperTexts: Record<string, string>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const BookDataSection: FC<BookDataSectionProps> = (props) => 
{
    const { book, isSubmitted, errors, helperTexts, onChange } = props;
    const { definition } = useDefinitionContext();
    const { contact } = useContactContext();

    const genres = definition[0];
    const languages = definition[1];
    const authors = contact[0];
    const publishers = contact[1];

    const getFieldProps = (fieldName: string, label: string) => 
    ({ 
        name: fieldName, label, value: book[fieldName] || '', onChange, size: 'small' as const, 
        error: isSubmitted && Boolean(errors[fieldName]), helperText: isSubmitted ? helperTexts[fieldName] : '',
    });

    return (
        <Box sx={{ ...displayAsColumn, marginLeft: '20px', gap: '20px', width: '60%' }}>
            <TextField {...getFieldProps('bookname', 'Book Name')} />

            <TextField select slotProps={optionFieldSlotProps} {...getFieldProps('genre', 'Genre')}>
                {
                    genres.map((item) => 
                    (
                        <MenuItem key={item.genre} value={item.genre}>{item.genre}</MenuItem>
                    ))
                }
            </TextField>

            <TextField select slotProps={optionFieldSlotProps} {...getFieldProps('language', 'Language')}>
                {
                    languages.map((item) => 
                    (
                        <MenuItem key={item.language} value={item.language}>{item.language}</MenuItem>
                    ))
                }
            </TextField>

            <TextField select slotProps={optionFieldSlotProps} {...getFieldProps('author', 'Author')}>
                {
                    authors.map((item) => 
                    (
                        <MenuItem key={item.author} value={item.author}>{item.author}</MenuItem>
                    ))
                }
            </TextField>

            <TextField select slotProps={optionFieldSlotProps} {...getFieldProps('publisher', 'Publisher')}>
                {
                    publishers.map((item) => 
                    (
                        <MenuItem key={item.publisher} value={item.publisher}>{item.publisher}</MenuItem>
                    ))
                }
            </TextField>

            <TextField type="date" {...getFieldProps('publishDate', 'Publish Date')} />

            <TextField multiline rows={8} {...getFieldProps('description', 'Description')} />
        </Box>
    );
};