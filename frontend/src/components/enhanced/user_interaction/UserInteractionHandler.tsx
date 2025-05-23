import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { UserInteraction, UserResponse } from '../../../types/UserInteractionTypes';
import { useDialog } from '../../../contexts/DialogContext';
import { useApi } from '../../../contexts/ApiContext';
import Logger from '../../../utils/Logger';

interface UserInteractionHandlerProps {
  userInteraction: UserInteraction;
  onUserResponse?: (interaction: UserInteraction) => void;
}

const UserInteractionHandler: React.FC<UserInteractionHandlerProps> = ({ 
  userInteraction, 
  onUserResponse 
}) => {
  const { openDialog } = useDialog();
  const { updateUserInteraction } = useApi();

  const handleUserInteraction = () => {
    openDialog({
      title: 'User Interaction Required',
      content: userInteraction.user_checkpoint_id.user_prompt,
      buttons: Object.entries(userInteraction.user_checkpoint_id.options_obj).map(([key, value]) => ({
        text: value,
        action: async () => {
          try {
            const response: UserResponse = {
              selected_option: parseInt(key),
            };
            
            const updatedInteraction = await updateUserInteraction(
              userInteraction._id as string, 
              { user_response: response }
            );
            
            Logger.debug('User interaction updated:', updatedInteraction);
            
            // Call the optional callback with the updated interaction
            onUserResponse?.(updatedInteraction);
          } catch (error) {
            Logger.error('Error handling user response:', error);
          }
        },
        color: 'primary',
        variant: key === '0' ? 'contained' : 'outlined',
      })),
    });
  };

  const truncatePrompt = (prompt: string, maxLength: number = 50) => {
    return prompt.length > maxLength ? `${prompt.substring(0, maxLength)}...` : prompt;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card sx={{ width: 200, height: 50, display: 'flex', alignItems: 'center', mb: 1 }}>
      <CardContent sx={{ flex: 1, p: 1, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" noWrap>
              {truncatePrompt(userInteraction.user_checkpoint_id.user_prompt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(userInteraction.createdAt)}
            </Typography>
          </Box>
          {userInteraction.user_response ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <IconButton size="small" onClick={handleUserInteraction}>
              <QuestionAnswerIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInteractionHandler;