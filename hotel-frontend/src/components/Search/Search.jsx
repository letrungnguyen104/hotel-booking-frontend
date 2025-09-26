import { Button, Col, DatePicker, Dropdown, Input, Row, Space } from 'antd'
import "./Search.scss"
import { DownOutlined, SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const Search = () => {

  const items = [
    { key: "1", label: "1 Adult" },
    { key: "2", label: "2 Adults" },
    { key: "3", label: "3 Adults" },
  ];

  return (
    <div className='search'>
      <Row gutter={[20, 20]}>
        <Col xxl={8} xl={8}>
          <Input
            className="search__input"
            prefix={<SearchOutlined className="form__icon" />}
            placeholder="Search location..."
          />
        </Col>
        <Col xxl={8} xl={8}>
          <RangePicker
            placeholder={["Check in", "Check out"]}
            format="DD-MM-YYYY"
            className="search__picker"
          />
        </Col>
        <Col xxl={4} xl={4}>
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultSelectedKeys: ["3"],
            }}
            trigger={["click"]}
          >
            <div className="search__dropdown">
              <Space>
                Number of People
                <DownOutlined />
              </Space>
            </div>
          </Dropdown>
        </Col>
        <Col xxl={4} xl={4}>
          <Button className="search__button" type="primary" icon={<SearchOutlined />} onClick={() => navigate("/search")}>
            Search
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default Search