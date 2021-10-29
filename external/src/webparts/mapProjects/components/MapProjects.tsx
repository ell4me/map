import React, {useState, MouseEvent, useRef, useEffect} from 'react';
import styles from './MapProjects.module.scss';
import {getProjects, getRegions, ProjectType} from '../../../api';
import {eurasiaRegions, naRegions} from '../../../regions';
import {IMapProjectsProps} from './IMapProjectsProps';


export const MapProjects = (props: IMapProjectsProps) => {
    const [activeContinent, setActiveContinent] = useState('Eurasia')
    const [coordinates, setCoordinates] = useState({x: 0, y: 0})
    const [regions, setRegions] = useState([])
    const [topProjects, setTopProjects] = useState<ProjectType[]>([])
    const ref = useRef<HTMLDivElement>(null)
    const onMouseOver = (e: MouseEvent<SVGGElement, globalThis.MouseEvent>) => {
        const {top: topParent, left: leftParent} = ref.current.getBoundingClientRect()
        const {top: topChild, left: leftChild} = e.currentTarget.getBoundingClientRect()
        const x = leftChild - leftParent - 20
        const y = topChild - topParent - 10
        setCoordinates({x, y})
    }
    const onMouseOut = () => {
        setCoordinates({x: 0, y: 0})
    }
    useEffect(() => {
        (async () => {
            const allProjects = await getProjects()
            const allRegions = await getRegions()
            console.log(allProjects, '2')
            console.log(allRegions, '3')
            const r = allProjects.map(project => {
                if(project.ProjectLarge && !project.ArchiveDate) {
                    return project
                }
            }).filter(item => !!item)
            setTopProjects(r)
        })()
    }, [activeContinent])
    return (
        <div className={styles.mapContainer} ref={ref}>
            <div className={`${styles.divisionContainer} ${coordinates.x ? styles.active : ''}`}
                 style={{top: coordinates.y, left: coordinates.x}}>
                <span>Название дивизиона</span>
            </div>
            <div className={styles.mapButtonsDiv}>
                <div className={styles.mapButtonsInnerDiv}>
                    <div className={styles.mapButtonsContainer}>
                        <div
                            className={`${styles.mapButton} ${activeContinent === 'Eurasia' ? styles.mapButtonActive : ''}`}
                            onClick={() => setActiveContinent('Eurasia')}>
                            Евразия
                        </div>
                        <div className={`${styles.mapButton} ${activeContinent === 'NA' ? styles.mapButtonActive : ''}`}
                             onClick={() => setActiveContinent('NA')}>
                            Северная Америка
                        </div>
                    </div>
                </div>
            </div>
            <div id="Map-Eurasia" className={`${styles.mapContinentContainer} ${activeContinent === 'Eurasia' ? styles.mapContinentVisibleContainer : ''}`}>
                <svg viewBox="0 0 751 392" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {eurasiaRegions.map((item, i) => {
                        return (
                            <g key={i} className={styles.regionDefault}>
                                <title>{item.title}</title>
                                {item.region}
                            </g>
                        )
                    })}
                </svg>
            </div>
            <div id="Map-NA"
                 className={`${styles.mapContinentContainer} ${activeContinent === 'NA' ? styles.mapContinentVisibleContainer : ''}`}>
                <svg viewBox="0 0 350 390" fill="none">
                    {naRegions.map((item, i) => {
                        return (
                            <g key={i} className={styles.regionDefault}>
                                <title>{item.title}</title>
                                {item.region}
                            </g>
                        )
                    })}
                </svg>
            </div>
            {!!topProjects.length &&
            <div className={styles.topProjectsContainer}>
                {topProjects.map(project => {
                    return (
                        <div key={project.Id} className={styles.projectItem}>
                            <div className={styles.division}>{project.ProjectDivisionLookup}</div>
                            <a className={styles.projectName}>
                                <span>{project.ProjectName}</span>
                                <svg width="17" height="13" viewBox="0 0 17 13" fill="none"><path d="M1 6.75L16 6.75" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.75 1.5L16 6.75L10.75 12" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </a>
                        </div>
                    )
                })}
            </div>
            }
        </div>
    );
};