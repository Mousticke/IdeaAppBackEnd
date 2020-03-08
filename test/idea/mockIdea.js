import {Idea} from '../../src/Models/Idea/ideaModel';

export const deleteAllIdeas = () => {
    return new Promise((resolve, reject) => {
        resolve(Idea.deleteMany());
    });
};

export const mockCreateIdea = (id) => {
    return new Idea({
        'title': 'New Idea from me',
        'summary': 'Explain what is my first idea',
        'details':
            'This has to be updated soon...',
        'userID': id,
    });
};

export const updateIdea = (title, summary, details) => {
    return {
        'title': title,
        'summary': summary,
        'details': details,
    };
};

export const mockCreateIdeaFromRoute = () => {
    return {
        'title': 'New title',
        'summary': 'New summary',
        'details': 'New details',
    };
};

export const mockIdeaFailureBody = () => {
    return {
        'title': 'New title',
        'summary': 'New summary',
    };
};

export const mockIdeaFailureValidation = () => {
    return {
        'title': 'New title',
        'summary': 'New summary',
        'details': 'N',
    };
};

export const mockUpdateIdeaSuccess = () => {
    return {
        'title': 'New title update',
        'summary': 'New summary',
        'details': 'Something different',
    };
};
