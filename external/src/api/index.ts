import {sp} from '@pnp/sp/presets/all';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

sp.setup({
    sp: {
        baseUrl: 'http://sp2019-rus5:26720/transport/',
    },
});
export type ProjectType = {
    ProjectName: string
    ProjectDivisionLookup: string
    ArchiveDate: string
    ProjectLarge: boolean
    Id: string
}
export const getProjects = (): Promise<ProjectType[]> => {
    console.log(1)
    return sp.web.lists.getByTitle('Projects').items.getAll().then(r => r)
};

export const getRegions = () => {
    return sp.web.lists.getByTitle('ProjectRegions').items.getAll().then(r => r)
}