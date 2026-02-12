import React, { useMemo, useState } from 'react'
import { Modal } from 'antd'

export const AppContext = React.createContext({})
export const useAppContext = () => React.useContext(AppContext)

const AppContextProvider = ({ children }) => {
    const [openWarning, setOpenWarning] = useState(false)
    const [handleAgree, setHandleAgree] = useState(() => { })

    const contextValues = useMemo(() => {
        return {
            openWarning,
            setOpenWarning,
            handleAgree,
            setHandleAgree
        }
    }, [openWarning, handleAgree])

    return (
        <AppContext.Provider value={contextValues}>
            {children}
            <Modal
                open={openWarning}
                onCancel={() => setOpenWarning(false)}
                onOk={handleAgree}
                destroyOnHidden={true}
                title={'Cảnh báo!'}
            >
                Bạn đang chỉnh sửa dữ liệu. Nếu thoát ra ngoài, dữ liệu sẽ bị
                mất. Bạn vẫn muốn thoát?
            </Modal>
        </AppContext.Provider>
    )
}

export default AppContextProvider