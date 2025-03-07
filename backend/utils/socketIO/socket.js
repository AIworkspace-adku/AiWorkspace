const Document = require('../../models/Document');

const socketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        const usersByDocument = {};

        socket.on('join-document', async (documentId) => {
            socket.join(documentId);
            if (!usersByDocument[documentId]) {
                usersByDocument[documentId] = {};
            }
            usersByDocument[documentId][socket.id] = { color: `#${Math.floor(Math.random() * 16777215).toString(16)}` };
            console.log(`Client joined room: ${documentId}`);

            try {
                let document = await Document.findById(documentId);
                if (!document) {
                    document = new Document({ _id: documentId, content: [] });
                    await document.save();
                }
                socket.emit('document-update', document.content); // Send initial content
            } catch (error) {
                console.error('Error joining document:', error);
            }
        });

        socket.on('document-change', async ({ _id, delta }) => {
            try {
                console.log(`Broadcasting changes for document ID: ${_id}`);
                // Broadcast changes to other clients
                socket.to(_id).emit('document-update', delta);
            } catch (error) {
                console.error('Error broadcasting document changes:', error);
            }
        });

        socket.on('cursor-move', ({ documentId, range, color, name }) => {
            socket.to(documentId).emit('cursor-update', {
                userId: socket.id,
                range,
                color,
                name,
            });
        });
        // Team chat
        socket.on('joinGroup', (teamId) => {
            socket.join(teamId);
            console.log(`Client joined team chat: ${teamId}`);
          });
      
          socket.on('sendMessage', (data) => {
            const { teamId, content, sender, _id, timestamp } = data;
            io.to(teamId).emit('message', {
              group: teamId,
              sender,
              content,
              _id,
              timestamp,
            });
          });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
            for (const documentId in usersByDocument) {
                delete usersByDocument[documentId][socket.id];
            }
        });
    });
}

module.exports = socketHandlers;